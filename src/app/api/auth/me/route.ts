import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Organization } from "@/lib/db/models/Organization";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ user: session });
  }

  await connectDB();
  const user = await User.findById(session.userId).lean();
  if (!user || user.deletedAt) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  let organization = null;
  if (session.organizationId) {
    organization = await Organization.findById(session.organizationId)
      .select("name slug planId subscriptionStatus")
      .lean();
  }

  return NextResponse.json({
    user: {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      orgRole: session.orgRole,
    },
    organization,
  });
}
