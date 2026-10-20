import { NextRequest, NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { SupportTicket } from "@/lib/db/models/SupportTicket";
import { contactSchema } from "@/lib/validations/auth";
import { hashIp } from "@/lib/security/crypto";
import { rateLimitContact } from "@/lib/security/rate-limit";
import { sendEmail } from "@/lib/notifications/email";
import { emailConfig, appConfig } from "@/lib/config";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = rateLimitContact(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form fields and try again.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Honeypot — bots fill hidden "website" field
  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  if (!isDbConfigured()) {
    return NextResponse.json(
      {
        error:
          "Contact form storage is unavailable until MongoDB is configured. Please email support@arolagblimited.store directly.",
      },
      { status: 503 }
    );
  }

  await connectDB();

  const ticket = await SupportTicket.create({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
    ipHash: hashIp(ip),
    userAgent: req.headers.get("user-agent")?.slice(0, 300) || null,
  });

  const emailed = await sendEmail({
    to: emailConfig.support,
    subject: `[Contact] ${parsed.data.subject}`,
    text: `New contact form submission via ${appConfig.name}\n\nFrom: ${parsed.data.name} <${parsed.data.email}>\nSubject: ${parsed.data.subject}\n\n${parsed.data.message}\n\nTicket ID: ${ticket._id}`,
  });

  if (emailed) {
    ticket.emailSent = true;
    await ticket.save();
  }

  return NextResponse.json({
    success: true,
    message:
      "Thank you. Your message has been received. We will respond via email.",
    emailDelivered: emailed,
  });
}
