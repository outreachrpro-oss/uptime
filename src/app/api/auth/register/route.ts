import { NextRequest, NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Organization } from "@/lib/db/models/Organization";
import { OrganizationMember } from "@/lib/db/models/OrganizationMember";
import { VerificationToken } from "@/lib/db/models/Token";
import { AlertChannel } from "@/lib/db/models/AlertChannel";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword, validatePasswordStrength } from "@/lib/security/password";
import { generateSecureToken, hashToken, hashIp, encryptSecret } from "@/lib/security/crypto";
import { rateLimitAuth } from "@/lib/security/rate-limit";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { slugify } from "@/lib/utils";
import { sendEmail } from "@/lib/notifications/email";
import { appConfig } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json(
        {
          error:
            "Database not configured. Set MONGODB_URI in environment variables.",
        },
        { status: 503 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limit = rateLimitAuth(ip, "register");
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const strength = validatePasswordStrength(parsed.data.password);
    if (!strength.ok) {
      return NextResponse.json({ error: strength.errors.join(". ") }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({
      email: parsed.data.email.toLowerCase(),
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await User.create({
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name,
      passwordHash,
      role: "user", // Never allow self-assignment of platform_admin
    });

    const orgName =
      parsed.data.organizationName || `${parsed.data.name}'s Workspace`;
    let slug = slugify(orgName);
    const slugExists = await Organization.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${generateSecureToken(3)}`;
    }

    const organization = await Organization.create({
      name: orgName,
      slug,
      ownerId: user._id,
      planId: "starter",
    });

    await OrganizationMember.create({
      organizationId: organization._id,
      userId: user._id,
      role: "org_owner",
      status: "active",
      acceptedAt: new Date(),
    });

    // Default email alert channel for the owner
    try {
      await AlertChannel.create({
        organizationId: organization._id,
        name: "Owner Email",
        type: "email",
        configEncrypted: encryptSecret(
          JSON.stringify({ email: user.email })
        ),
        createdBy: user._id,
      });
    } catch {
      // Encryption key may not be set in early setup
    }

    const verifyToken = generateSecureToken(32);
    await VerificationToken.create({
      userId: user._id,
      tokenHash: hashToken(verifyToken),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await sendEmail({
      to: user.email,
      subject: `Verify your ${appConfig.name} account`,
      text: `Welcome to ${appConfig.name}!\n\nVerify your email:\n${appConfig.url}/verify-email?token=${verifyToken}\n\nThis link expires in 24 hours.`,
    });

    await AuditLog.create({
      organizationId: organization._id,
      userId: user._id,
      action: "user.registered",
      resourceType: "user",
      resourceId: String(user._id),
      ipHash: hashIp(ip),
    });

    const sessionToken = await createSessionToken({
      userId: String(user._id),
      email: user.email,
      name: user.name,
      role: "user",
      organizationId: String(organization._id),
      orgRole: "org_owner",
    });
    await setSessionCookie(sessionToken);

    return NextResponse.json({
      success: true,
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
      },
      organization: {
        id: String(organization._id),
        name: organization.name,
        slug: organization.slug,
      },
    });
  } catch (error) {
    console.error("[register]", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
