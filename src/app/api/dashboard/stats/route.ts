import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { Monitor } from "@/lib/db/models/Monitor";
import { Incident } from "@/lib/db/models/Incident";
import { MonitorCheck } from "@/lib/db/models/MonitorCheck";
import { getSession } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";

export async function GET() {
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
    return NextResponse.json({
      totalMonitors: 0,
      up: 0,
      down: 0,
      paused: 0,
      activeIncidents: 0,
      avgResponseMs: null,
      uptimePercent24h: null,
      recentAlerts: [],
    });
  }

  await connectDB();
  const orgId = session.organizationId;

  const [totalMonitors, up, down, paused, activeIncidents, recentChecks] =
    await Promise.all([
      Monitor.countDocuments({ organizationId: orgId, deletedAt: null }),
      Monitor.countDocuments({
        organizationId: orgId,
        deletedAt: null,
        status: "up",
      }),
      Monitor.countDocuments({
        organizationId: orgId,
        deletedAt: null,
        status: "down",
      }),
      Monitor.countDocuments({
        organizationId: orgId,
        deletedAt: null,
        isPaused: true,
      }),
      Incident.countDocuments({ organizationId: orgId, isActive: true }),
      MonitorCheck.find({
        organizationId: orgId,
        checkedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      })
        .select("status responseTimeMs")
        .lean(),
    ]);

  const withTiming = recentChecks.filter((c) => c.responseTimeMs != null);
  const avgResponseMs = withTiming.length
    ? Math.round(
        withTiming.reduce((s, c) => s + (c.responseTimeMs || 0), 0) /
          withTiming.length
      )
    : null;

  const successful = recentChecks.filter((c) => c.status === "up").length;
  const uptimePercent24h = recentChecks.length
    ? Math.round((successful / recentChecks.length) * 10000) / 100
    : null;

  const recentIncidents = await Incident.find({ organizationId: orgId })
    .sort({ startedAt: -1 })
    .limit(5)
    .populate("monitorId", "name url")
    .lean();

  return NextResponse.json({
    totalMonitors,
    up,
    down,
    paused,
    activeIncidents,
    avgResponseMs,
    uptimePercent24h,
    recentIncidents,
  });
}
