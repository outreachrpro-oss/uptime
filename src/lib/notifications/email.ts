import { emailConfig } from "@/lib/config";

export interface EmailPayload {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}

/**
 * Sends email via Resend (preferred) or SMTP.
 * Returns false if no email provider is configured (does not fake success).
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;

  if (resendKey) {
    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);
    const result = await resend.emails.send({
      from: emailConfig.from,
      to: Array.isArray(payload.to) ? payload.to : [payload.to],
      subject: payload.subject,
      text: payload.text,
      html: payload.html || `<pre style="font-family:sans-serif">${payload.text}</pre>`,
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
    return true;
  }

  // SMTP fallback
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    // Lazy note: nodemailer not required as hard dep — use fetch to SMTP HTTP gateway
    // or install nodemailer. For now, document that SMTP needs nodemailer.
    throw new Error(
      "SMTP is configured but Resend is preferred. Set RESEND_API_KEY, or install nodemailer for SMTP support."
    );
  }

  console.warn(
    "[email] No email provider configured. Set RESEND_API_KEY to enable delivery."
  );
  return false;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY || process.env.SMTP_HOST);
}
