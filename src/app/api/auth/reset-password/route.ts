import { NextRequest, NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { PasswordResetToken } from "@/lib/db/models/Token";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { hashPassword, validatePasswordStrength } from "@/lib/security/password";
import { hashToken } from "@/lib/security/crypto";
import { rateLimitAuth } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Database not configured." },
      { status: 503 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = rateLimitAuth(ip, "reset");
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const strength = validatePasswordStrength(parsed.data.password);
  if (!strength.ok) {
    return NextResponse.json({ error: strength.errors.join(". ") }, { status: 400 });
  }

  await connectDB();
  const tokenDoc = await PasswordResetToken.findOne({
    tokenHash: hashToken(parsed.data.token),
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!tokenDoc) {
    return NextResponse.json(
      { error: "Invalid or expired reset token." },
      { status: 400 }
    );
  }

  const user = await User.findById(tokenDoc.userId).select("+passwordHash");
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  user.passwordHash = await hashPassword(parsed.data.password);
  await user.save();

  tokenDoc.usedAt = new Date();
  await tokenDoc.save();

  return NextResponse.json({
    success: true,
    message: "Password updated. You can now sign in.",
  });
}
