import { NextRequest, NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { Incident } from "@/lib/db/models/Incident";
import { getSession } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    requirePermission(session, "incidents:read");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ incidents: [], total: 0 });
  }

  await connectDB();
  const { searchParams } = new URL(req.url);
  const active = searchParams.get("active");
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(50, Number(searchParams.get("limit") || 20));

  const filter: Record<string, unknown> = {
    organizationId: session.organizationId,
  };
  if (active === "true") filter.isActive = true;
  if (active === "false") filter.isActive = false;

  const [incidents, total] = await Promise.all([
    Incident.find(filter)
      .sort({ startedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("monitorId", "name url status")
      .lean(),
    Incident.countDocuments(filter),
  ]);

  return NextResponse.json({ incidents, total, page, limit });
}
