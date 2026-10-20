import { NextRequest, NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { OrganizationMember } from "@/lib/db/models/OrganizationMember";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { loginSchema } from "@/lib/validations/auth";
import { verifyPassword } from "@/lib/security/password";
import { hashIp } from "@/lib/security/crypto";
import { rateLimitAuth } from "@/lib/security/rate-limit";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json(
        { error: "Database not configured. Set MONGODB_URI." },
        { status: 503 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limit = rateLimitAuth(ip, "login");
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({
      email: parsed.data.email.toLowerCase(),
      deletedAt: null,
    }).select("+passwordHash");

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const membership = await OrganizationMember.findOne({
      userId: user._id,
      status: "active",
    }).sort({ createdAt: 1 });

    user.lastLoginAt = new Date();
    await user.save();

    const sessionToken = await createSessionToken({
      userId: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role === "platform_admin" ? "platform_admin" : "user",
      organizationId: membership ? String(membership.organizationId) : undefined,
      orgRole: membership?.role,
    });
    await setSessionCookie(sessionToken);

    await AuditLog.create({
      organizationId: membership?.organizationId,
      userId: user._id,
      action: "user.login",
      resourceType: "user",
      resourceId: String(user._id),
      ipHash: hashIp(ip),
    });

    return NextResponse.json({
      success: true,
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[login]", error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
