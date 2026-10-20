import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Organization } from "@/lib/db/models/Organization";
import { getSession } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { appConfig } from "@/lib/config";

export async function POST() {
  const session = await getSession();
  if (!session?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    requirePermission(session, "billing:write");
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured.", configured: false },
      { status: 503 }
    );
  }

  await connectDB();
  const org = await Organization.findById(session.organizationId);
  if (!org?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account found. Subscribe to a paid plan first." },
      { status: 400 }
    );
  }

  const stripe = getStripe()!;
  const portal = await stripe.billingPortal.sessions.create({
    customer: org.stripeCustomerId,
    return_url: `${appConfig.url}/dashboard/billing`,
  });

  return NextResponse.json({ url: portal.url });
}
