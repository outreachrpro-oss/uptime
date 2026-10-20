import { NextRequest, NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { Monitor } from "@/lib/db/models/Monitor";
import { MonitorCheck } from "@/lib/db/models/MonitorCheck";
import { Incident } from "@/lib/db/models/Incident";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { getSession } from "@/lib/auth/session";
import { requirePermission, assertSameOrganization } from "@/lib/auth/rbac";
import { updateMonitorSchema } from "@/lib/validations/monitor";
import { validateMonitorUrl } from "@/lib/security/ssrf";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
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
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { id } = await params;
  await connectDB();

  const monitor = await Monitor.findOne({
    _id: id,
    organizationId: session.organizationId,
    deletedAt: null,
  }).lean();

  if (!monitor) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  const [checks, incidents] = await Promise.all([
    MonitorCheck.find({ monitorId: id })
      .sort({ checkedAt: -1 })
      .limit(100)
      .lean(),
    Incident.find({ monitorId: id })
      .sort({ startedAt: -1 })
      .limit(20)
      .lean(),
  ]);

  return NextResponse.json({ monitor, checks, incidents });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    requirePermission(session, "monitors:write");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = updateMonitorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (parsed.data.url) {
    const urlCheck = await validateMonitorUrl(parsed.data.url, {
      forTcp: parsed.data.type === "tcp",
      allowCustomPorts: parsed.data.type === "tcp",
    });
    if (!urlCheck.ok) {
      return NextResponse.json({ error: urlCheck.reason }, { status: 400 });
    }
  }

  await connectDB();
  const monitor = await Monitor.findOne({
    _id: id,
    organizationId: session.organizationId,
    deletedAt: null,
  });

  if (!monitor) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  assertSameOrganization(session, String(monitor.organizationId));

  Object.assign(monitor, parsed.data);
  if (parsed.data.isPaused === true) {
    monitor.pausedAt = new Date();
    monitor.status = "paused";
  } else if (parsed.data.isPaused === false) {
    monitor.pausedAt = null;
    monitor.status = "pending";
    monitor.nextCheckAt = new Date();
  }

  await monitor.save();

  await AuditLog.create({
    organizationId: monitor.organizationId,
    userId: session.userId,
    action: "monitor.updated",
    resourceType: "monitor",
    resourceId: id,
  });

  return NextResponse.json({ monitor });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    requirePermission(session, "monitors:write");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();

  const monitor = await Monitor.findOne({
    _id: id,
    organizationId: session.organizationId,
    deletedAt: null,
  });

  if (!monitor) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  monitor.deletedAt = new Date();
  monitor.isPaused = true;
  await monitor.save();

  await AuditLog.create({
    organizationId: monitor.organizationId,
    userId: session.userId,
    action: "monitor.deleted",
    resourceType: "monitor",
    resourceId: id,
  });

  return NextResponse.json({ success: true });
}
