import { NextRequest, NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { PasswordResetToken } from "@/lib/db/models/Token";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { generateSecureToken, hashToken } from "@/lib/security/crypto";
import { rateLimitAuth } from "@/lib/security/rate-limit";
import { sendEmail } from "@/lib/notifications/email";
import { appConfig } from "@/lib/config";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = rateLimitAuth(ip, "forgot");
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  // Always return success to prevent email enumeration
  const successMessage = {
    success: true,
    message:
      "If an account exists with that email, a reset link has been sent.",
  };

  if (!isDbConfigured()) {
    return NextResponse.json(successMessage);
  }

  const body = await req.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(successMessage);
  }

  await connectDB();
  const user = await User.findOne({
    email: parsed.data.email.toLowerCase(),
    deletedAt: null,
  });

  if (user) {
    const token = generateSecureToken(32);
    await PasswordResetToken.create({
      userId: user._id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    await sendEmail({
      to: user.email,
      subject: `Reset your ${appConfig.name} password`,
      text: `Reset your password:\n${appConfig.url}/reset-password?token=${token}\n\nThis link expires in 1 hour.\nIf you did not request this, ignore this email.`,
    });
  }

  return NextResponse.json(successMessage);
}
