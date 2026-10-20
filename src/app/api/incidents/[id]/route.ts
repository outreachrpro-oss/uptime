import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { Incident } from "@/lib/db/models/Incident";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { getSession } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";

type Params = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  status: z
    .enum(["investigating", "identified", "monitoring", "resolved"])
    .optional(),
  notes: z.string().max(5000).optional(),
  acknowledge: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    requirePermission(session, "incidents:read");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();

  const incident = await Incident.findOne({
    _id: id,
    organizationId: session.organizationId,
  })
    .populate("monitorId", "name url status")
    .lean();

  if (!incident) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ incident });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    requirePermission(session, "incidents:write");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await connectDB();
  const incident = await Incident.findOne({
    _id: id,
    organizationId: session.organizationId,
  });

  if (!incident) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (parsed.data.acknowledge) {
    incident.acknowledgedAt = new Date();
    incident.acknowledgedBy = session.userId as unknown as typeof incident.acknowledgedBy;
    incident.events.push({
      type: "acknowledged",
      message: "Incident acknowledged",
      userId: session.userId as unknown as typeof incident.events[0]["userId"],
      createdAt: new Date(),
    });
  }

  if (parsed.data.status) {
    incident.status = parsed.data.status;
    if (parsed.data.status === "resolved") {
      incident.isActive = false;
      incident.resolvedAt = new Date();
      incident.durationMs =
        incident.resolvedAt.getTime() - incident.startedAt.getTime();
    }
    incident.events.push({
      type: "status_change",
      message: `Status changed to ${parsed.data.status}`,
      status: parsed.data.status,
      userId: session.userId as unknown as typeof incident.events[0]["userId"],
      createdAt: new Date(),
    });
  }

  if (parsed.data.notes !== undefined) {
    incident.notes = parsed.data.notes;
    incident.events.push({
      type: "note",
      message: parsed.data.notes,
      userId: session.userId as unknown as typeof incident.events[0]["userId"],
      createdAt: new Date(),
    });
  }

  await incident.save();

  await AuditLog.create({
    organizationId: session.organizationId,
    userId: session.userId,
    action: "incident.updated",
    resourceType: "incident",
    resourceId: id,
  });

  return NextResponse.json({ incident });
}
