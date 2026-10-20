import { NextRequest, NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { Monitor } from "@/lib/db/models/Monitor";
import { Organization } from "@/lib/db/models/Organization";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { getSession } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";
import { createMonitorSchema } from "@/lib/validations/monitor";
import { validateMonitorUrl } from "@/lib/security/ssrf";
import { plans, type PlanId } from "@/lib/config";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    requirePermission(session, "monitors:read");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ monitors: [], total: 0 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("q");
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 20)));

  const filter: Record<string, unknown> = {
    organizationId: session.organizationId,
    deletedAt: null,
  };
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { url: { $regex: search, $options: "i" } },
    ];
  }

  const [monitors, total] = await Promise.all([
    Monitor.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Monitor.countDocuments(filter),
  ]);

  return NextResponse.json({ monitors, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    requirePermission(session, "monitors:write");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Database not configured." },
      { status: 503 }
    );
  }

  const body = await req.json();
  const parsed = createMonitorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid monitor configuration", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // SSRF validation before save
  const urlCheck = await validateMonitorUrl(parsed.data.url, {
    forTcp: parsed.data.type === "tcp",
    allowCustomPorts: parsed.data.type === "tcp",
  });
  if (!urlCheck.ok) {
    return NextResponse.json({ error: urlCheck.reason }, { status: 400 });
  }

  await connectDB();

  const org = await Organization.findById(session.organizationId);
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const plan = plans[org.planId as PlanId] || plans.starter;
  const currentCount = await Monitor.countDocuments({
    organizationId: org._id,
    deletedAt: null,
  });

  if (currentCount >= plan.limits.monitors) {
    return NextResponse.json(
      {
        error: `Plan limit reached. Your ${plan.name} plan allows ${plan.limits.monitors} monitors. Upgrade to add more.`,
      },
      { status: 403 }
    );
  }

  if (parsed.data.intervalSeconds < plan.limits.minIntervalSeconds) {
    return NextResponse.json(
      {
        error: `Minimum interval for your plan is ${plan.limits.minIntervalSeconds} seconds.`,
      },
      { status: 403 }
    );
  }

  if (
    (parsed.data.type === "ssl" || parsed.data.type === "dns") &&
    !plan.limits.sslMonitoring &&
    parsed.data.type === "ssl"
  ) {
    return NextResponse.json(
      { error: "SSL monitoring requires Pro or Business plan." },
      { status: 403 }
    );
  }

  let host: string | null = null;
  try {
    host = new URL(parsed.data.url).hostname;
  } catch {
    host = parsed.data.url;
  }

  const monitor = await Monitor.create({
    organizationId: org._id,
    createdBy: session.userId,
    name: parsed.data.name,
    url: parsed.data.url,
    host,
    port: parsed.data.port,
    type: parsed.data.type,
    intervalSeconds: parsed.data.intervalSeconds,
    timeoutMs: parsed.data.timeoutMs,
    expectedStatus: parsed.data.expectedStatus,
    keyword: parsed.data.keyword,
    keywordMode: parsed.data.keywordMode,
    method: parsed.data.method,
    failureThreshold: parsed.data.failureThreshold,
    recoveryThreshold: parsed.data.recoveryThreshold,
    tags: parsed.data.tags,
    alertChannelIds: parsed.data.alertChannelIds,
    followRedirects: parsed.data.followRedirects,
    nextCheckAt: new Date(),
    status: "pending",
  });

  await AuditLog.create({
    organizationId: org._id,
    userId: session.userId,
    action: "monitor.created",
    resourceType: "monitor",
    resourceId: String(monitor._id),
  });

  return NextResponse.json({ monitor }, { status: 201 });
}
