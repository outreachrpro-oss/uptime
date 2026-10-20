import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { StatusPage } from "@/lib/db/models/StatusPage";
import { Organization } from "@/lib/db/models/Organization";
import { getSession } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";
import { slugify } from "@/lib/utils";
import { plans, type PlanId } from "@/lib/config";
import { generateSecureToken } from "@/lib/security/crypto";

const createSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
  monitorIds: z.array(z.string()).default([]),
  primaryColor: z.string().optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    requirePermission(session, "status:read");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ pages: [] });
  }

  await connectDB();
  const pages = await StatusPage.find({
    organizationId: session.organizationId,
    deletedAt: null,
  })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    requirePermission(session, "status:write");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await connectDB();
  const org = await Organization.findById(session.organizationId);
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const plan = plans[org.planId as PlanId] || plans.starter;
  const count = await StatusPage.countDocuments({
    organizationId: org._id,
    deletedAt: null,
  });

  if (count >= plan.limits.statusPages) {
    return NextResponse.json(
      {
        error: `Your ${plan.name} plan allows ${plan.limits.statusPages} status pages. Upgrade to add more.`,
      },
      { status: 403 }
    );
  }

  let slug = slugify(parsed.data.name);
  if (await StatusPage.findOne({ slug })) {
    slug = `${slug}-${generateSecureToken(2)}`;
  }

  const page = await StatusPage.create({
    organizationId: org._id,
    name: parsed.data.name,
    slug,
    description: parsed.data.description || "",
    isPublic: parsed.data.isPublic,
    branding: {
      primaryColor: parsed.data.primaryColor || "#4F46E5",
    },
    components: parsed.data.monitorIds.map((id, index) => ({
      monitorId: id,
      displayName: `Service ${index + 1}`,
      sortOrder: index,
      group: "Services",
    })),
    createdBy: session.userId,
  });

  return NextResponse.json({ page }, { status: 201 });
}
