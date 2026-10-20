/**
 * AROLAGB Uptime — Dedicated background monitoring worker
 *
 * Must run on always-on infrastructure (Railway, Render, Fly.io, Docker).
 * Does NOT depend on Vercel serverless or browser timers.
 *
 * Start: npm run worker
 */

import "dotenv/config";
import { Worker, Queue, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import mongoose from "mongoose";
import { randomUUID } from "crypto";

import { performHttpCheck } from "../src/lib/monitoring/http-check";
import { performTcpCheck } from "../src/lib/monitoring/tcp-check";
import { performSslCheck } from "../src/lib/monitoring/ssl-check";
import { evaluateIncidentRules } from "../src/lib/monitoring/incident-engine";
import { Monitor } from "../src/lib/db/models/Monitor";
import { MonitorCheck } from "../src/lib/db/models/MonitorCheck";
import { SchedulerState } from "../src/lib/db/models/SchedulerState";
import { sendIncidentAlerts } from "../src/lib/notifications/dispatcher";

const WORKER_ID = `worker-${randomUUID().slice(0, 8)}`;
const CONCURRENCY = Number(process.env.WORKER_CONCURRENCY) || 10;
const SCHEDULER_TICK_MS = 15_000;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

const redisUrl = requireEnv("REDIS_URL");
const mongoUri = requireEnv("MONGODB_URI");

const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const monitorQueue = new Queue("monitor-checks", { connection });
export const alertQueue = new Queue("alert-delivery", { connection });

async function connectMongo() {
  await mongoose.connect(mongoUri, { maxPoolSize: 5 });
  console.log(`[${WORKER_ID}] Connected to MongoDB`);
}

async function enqueueDueMonitors() {
  const now = new Date();
  const due = await Monitor.find({
    isPaused: false,
    deletedAt: null,
    nextCheckAt: { $lte: now },
  })
    .limit(200)
    .select("_id organizationId intervalSeconds")
    .lean();

  for (const monitor of due) {
    const jobId = `check-${monitor._id}-${Math.floor(now.getTime() / ((monitor.intervalSeconds || 300) * 1000))}`;
    await monitorQueue.add(
      "check",
      {
        monitorId: String(monitor._id),
        organizationId: String(monitor.organizationId),
      },
      {
        jobId,
        removeOnComplete: 1000,
        removeOnFail: 5000,
        attempts: 2,
        backoff: { type: "exponential", delay: 2000 },
      }
    );
  }

  await SchedulerState.findOneAndUpdate(
    { key: "primary" },
    {
      key: "primary",
      workerId: WORKER_ID,
      lastHeartbeatAt: now,
      lastTickAt: now,
      status: "running",
      metadata: { enqueued: due.length },
    },
    { upsert: true }
  );

  if (due.length > 0) {
    console.log(`[${WORKER_ID}] Enqueued ${due.length} monitors`);
  }
}

async function runCheck(monitorId: string, organizationId: string) {
  const monitor = await Monitor.findById(monitorId);
  if (!monitor || monitor.deletedAt || monitor.isPaused) {
    return;
  }

  // Skip if in maintenance window
  const now = new Date();
  const inMaintenance = (monitor.maintenanceWindows || []).some(
    (w) => w.startsAt <= now && w.endsAt >= now
  );
  if (inMaintenance) {
    monitor.nextCheckAt = new Date(now.getTime() + monitor.intervalSeconds * 1000);
    await monitor.save();
    return;
  }

  let result;
  const type = monitor.type;

  if (type === "tcp") {
    const host = monitor.host || new URL(monitor.url).hostname;
    const port = monitor.port || 80;
    result = await performTcpCheck({
      host,
      port,
      timeoutMs: monitor.timeoutMs,
    });
  } else if (type === "ssl") {
    const host = monitor.host || new URL(monitor.url.replace(/^https?:\/\//, "https://")).hostname;
    result = await performSslCheck({
      host,
      timeoutMs: monitor.timeoutMs,
    });
    if (result.sslExpiresAt) {
      monitor.sslExpiresAt = result.sslExpiresAt;
      monitor.sslIssuer = result.sslIssuer;
      monitor.sslValid = result.sslValid;
    }
  } else {
    // http, https, keyword, dns (dns uses HTTP reachability as baseline)
    result = await performHttpCheck({
      url: monitor.url,
      method: (monitor.method as "GET" | "HEAD" | "POST") || "GET",
      timeoutMs: monitor.timeoutMs,
      expectedStatus: monitor.expectedStatus || 200,
      keyword: type === "keyword" ? monitor.keyword : null,
      keywordMode: type === "keyword" ? monitor.keywordMode : null,
      followRedirects: monitor.followRedirects !== false,
    });
  }

  await MonitorCheck.create({
    organizationId: monitor.organizationId,
    monitorId: monitor._id,
    status: result.status,
    responseTimeMs: result.responseTimeMs,
    statusCode: result.statusCode,
    errorCode: result.errorCode,
    errorMessage: result.errorMessage,
    timing: result.timing,
    checkedAt: result.checkedAt,
  });

  const evaluation = await evaluateIncidentRules(
    monitorId,
    organizationId,
    result,
    {
      failureThreshold: monitor.failureThreshold || 2,
      recoveryThreshold: monitor.recoveryThreshold || 1,
    }
  );

  if (evaluation.incidentCreated || evaluation.incidentResolved) {
    await alertQueue.add(
      "notify",
      {
        monitorId,
        organizationId,
        incidentId: evaluation.incidentId,
        type: evaluation.incidentCreated ? "monitor_down" : "monitor_recovered",
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 3000 },
        removeOnComplete: 1000,
      }
    );
  }
}

const checkWorker = new Worker(
  "monitor-checks",
  async (job) => {
    const { monitorId, organizationId } = job.data as {
      monitorId: string;
      organizationId: string;
    };
    await runCheck(monitorId, organizationId);
  },
  { connection, concurrency: CONCURRENCY }
);

const alertWorker = new Worker(
  "alert-delivery",
  async (job) => {
    await sendIncidentAlerts(job.data);
  },
  { connection, concurrency: 5 }
);

checkWorker.on("failed", (job, err) => {
  console.error(`[${WORKER_ID}] Check job failed`, job?.id, err.message);
});

alertWorker.on("failed", (job, err) => {
  console.error(`[${WORKER_ID}] Alert job failed`, job?.id, err.message);
});

const queueEvents = new QueueEvents("monitor-checks", { connection });

let schedulerTimer: NodeJS.Timeout | null = null;
let shuttingDown = false;

async function heartbeat() {
  await SchedulerState.findOneAndUpdate(
    { key: "primary" },
    { lastHeartbeatAt: new Date(), workerId: WORKER_ID, status: "running" },
    { upsert: true }
  );
}

async function start() {
  await connectMongo();
  console.log(`[${WORKER_ID}] Monitoring worker started (concurrency=${CONCURRENCY})`);

  await enqueueDueMonitors();
  schedulerTimer = setInterval(() => {
    if (!shuttingDown) {
      enqueueDueMonitors().catch((err) =>
        console.error(`[${WORKER_ID}] Scheduler tick error`, err)
      );
      heartbeat().catch(() => undefined);
    }
  }, SCHEDULER_TICK_MS);
}

async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[${WORKER_ID}] Shutting down (${signal})...`);
  if (schedulerTimer) clearInterval(schedulerTimer);
  await SchedulerState.findOneAndUpdate(
    { key: "primary" },
    { status: "stopped", lastHeartbeatAt: new Date() }
  );
  await checkWorker.close();
  await alertWorker.close();
  await queueEvents.close();
  await monitorQueue.close();
  await alertQueue.close();
  await connection.quit();
  await mongoose.disconnect();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start().catch((err) => {
  console.error(`[${WORKER_ID}] Fatal startup error`, err);
  process.exit(1);
});
