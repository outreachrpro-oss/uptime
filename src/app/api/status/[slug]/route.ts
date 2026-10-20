import { NextRequest, NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { StatusPage } from "@/lib/db/models/StatusPage";
import { Monitor } from "@/lib/db/models/Monitor";
import { Incident } from "@/lib/db/models/Incident";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Status pages unavailable — database not configured" },
      { status: 503 }
    );
  }

  const { slug } = await params;
  await connectDB();

  const page = await StatusPage.findOne({
    slug: slug.toLowerCase(),
    deletedAt: null,
    isPublic: true,
  }).lean();

  if (!page) {
    return NextResponse.json({ error: "Status page not found" }, { status: 404 });
  }

  const monitorIds = (page.components || []).map((c) => c.monitorId);
  const monitors = await Monitor.find({
    _id: { $in: monitorIds },
    deletedAt: null,
  })
    .select("name status lastCheckedAt uptimePercent30d lastResponseTimeMs")
    .lean();

  const monitorMap = new Map(monitors.map((m) => [String(m._id), m]));

  const components = (page.components || [])
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((c) => {
      const monitor = monitorMap.get(String(c.monitorId));
      return {
        id: String(c._id),
        displayName: c.displayName,
        description: c.description,
        group: c.group,
        status: monitor?.status || "unknown",
        uptimePercent30d: monitor?.uptimePercent30d ?? null,
        lastCheckedAt: monitor?.lastCheckedAt ?? null,
      };
    });

  const overallStatus = components.some((c) => c.status === "down")
    ? "major_outage"
    : components.some((c) => c.status === "degraded")
      ? "partial_outage"
      : components.every((c) => c.status === "up")
        ? "operational"
        : "unknown";

  const incidents = page.showIncidents
    ? await Incident.find({
        organizationId: page.organizationId,
        monitorId: { $in: monitorIds },
        startedAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      })
        .sort({ startedAt: -1 })
        .limit(20)
        .select(
          "incidentNumber status isActive failureReason startedAt resolvedAt durationMs events"
        )
        .lean()
    : [];

  // Never expose credentials or internal diagnostics
  return NextResponse.json({
    name: page.name,
    description: page.description,
    branding: page.branding,
    overallStatus,
    components,
    incidents: incidents.map((i) => ({
      number: i.incidentNumber,
      status: i.status,
      isActive: i.isActive,
      summary: i.failureReason,
      startedAt: i.startedAt,
      resolvedAt: i.resolvedAt,
      durationMs: i.durationMs,
      updates: (i.events || []).map((e) => ({
        type: e.type,
        message: e.message,
        status: e.status,
        at: e.createdAt,
      })),
    })),
  });
}
