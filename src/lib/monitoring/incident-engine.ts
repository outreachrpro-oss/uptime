import mongoose from "mongoose";
import { Incident } from "@/lib/db/models/Incident";
import { Monitor } from "@/lib/db/models/Monitor";
import type { CheckResult } from "./http-check";

export interface IncidentEvaluationResult {
  incidentCreated: boolean;
  incidentResolved: boolean;
  incidentId: string | null;
  monitorStatus: string;
}

/**
 * Evaluate consecutive failure/recovery thresholds and manage incidents.
 * Does not mark down after a single transient failure unless threshold is 1.
 */
export async function evaluateIncidentRules(
  monitorId: string,
  organizationId: string,
  result: CheckResult,
  thresholds: { failureThreshold: number; recoveryThreshold: number }
): Promise<IncidentEvaluationResult> {
  const monitor = await Monitor.findById(monitorId);
  if (!monitor || monitor.deletedAt) {
    return {
      incidentCreated: false,
      incidentResolved: false,
      incidentId: null,
      monitorStatus: "unknown",
    };
  }

  const isSuccess = result.status === "up";
  let incidentCreated = false;
  let incidentResolved = false;
  let incidentId: string | null = null;

  if (isSuccess) {
    monitor.consecutiveSuccesses = (monitor.consecutiveSuccesses || 0) + 1;
    monitor.consecutiveFailures = 0;
    monitor.lastError = null;

    if (
      monitor.status === "down" &&
      monitor.consecutiveSuccesses >= thresholds.recoveryThreshold
    ) {
      const active = await Incident.findOne({
        monitorId,
        isActive: true,
      });

      if (active) {
        const now = new Date();
        active.status = "resolved";
        active.isActive = false;
        active.resolvedAt = now;
        active.durationMs = now.getTime() - active.startedAt.getTime();
        active.events.push({
          type: "resolved",
          message: "Monitor recovered after consecutive successful checks",
          status: "resolved",
          createdAt: now,
        });
        await active.save();
        incidentResolved = true;
        incidentId = String(active._id);
      }

      monitor.status = "up";
      monitor.lastStatusChangeAt = new Date();
    } else if (monitor.status === "pending" || monitor.status === "unknown") {
      monitor.status = "up";
      monitor.lastStatusChangeAt = new Date();
    }
  } else {
    monitor.consecutiveFailures = (monitor.consecutiveFailures || 0) + 1;
    monitor.consecutiveSuccesses = 0;
    monitor.lastError = result.errorMessage || result.errorCode || "Check failed";

    if (monitor.consecutiveFailures >= thresholds.failureThreshold) {
      if (monitor.status !== "down") {
        monitor.status = "down";
        monitor.lastStatusChangeAt = new Date();

        // Prevent duplicate active incidents
        const existing = await Incident.findOne({
          monitorId,
          isActive: true,
        });

        if (!existing) {
          const lastIncident = await Incident.findOne({ organizationId })
            .sort({ incidentNumber: -1 })
            .select("incidentNumber")
            .lean();

          const incidentNumber = (lastIncident?.incidentNumber || 0) + 1;
          const now = new Date();
          const incident = await Incident.create({
            organizationId: new mongoose.Types.ObjectId(organizationId),
            monitorId: new mongoose.Types.ObjectId(monitorId),
            incidentNumber,
            status: "investigating",
            isActive: true,
            failureReason:
              result.errorMessage || result.errorCode || "Monitor check failed",
            errorCode: result.errorCode,
            startedAt: now,
            events: [
              {
                type: "created",
                message: `Incident opened: ${result.errorMessage || result.errorCode}`,
                status: "investigating",
                createdAt: now,
              },
            ],
          });
          incidentCreated = true;
          incidentId = String(incident._id);
        } else {
          incidentId = String(existing._id);
        }
      }
    }
  }

  monitor.lastCheckedAt = result.checkedAt;
  monitor.lastResponseTimeMs = result.responseTimeMs;
  monitor.nextCheckAt = new Date(
    Date.now() + (monitor.intervalSeconds || 300) * 1000
  );
  await monitor.save();

  return {
    incidentCreated,
    incidentResolved,
    incidentId,
    monitorStatus: monitor.status,
  };
}
