import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { Organization } from "@/lib/db/models/Organization";
import { getSession } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";
import { getStripe, getStripePriceId, isStripeConfigured } from "@/lib/stripe/client";
import { appConfig, type PlanId } from "@/lib/config";

const schema = z.object({
  planId: z.enum(["pro", "business"]),
  interval: z.enum(["monthly", "yearly"]),
});

export async function POST(req: NextRequest) {
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
      {
        error:
          "Stripe is not configured. Set STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, and price IDs.",
        configured: false,
      },
      { status: 503 }
    );
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan selection" }, { status: 400 });
  }

  const priceId = getStripePriceId(
    parsed.data.planId as PlanId,
    parsed.data.interval
  );
  if (!priceId) {
    return NextResponse.json(
      {
        error:
          "Stripe price ID not configured for this plan. Set STRIPE_PRICE_* environment variables.",
      },
      { status: 503 }
    );
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  await connectDB();
  const org = await Organization.findById(session.organizationId);
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const stripe = getStripe()!;
  let customerId = org.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.email,
      name: org.name,
      metadata: {
        organizationId: String(org._id),
        userId: session.userId,
      },
    });
    customerId = customer.id;
    org.stripeCustomerId = customerId;
    await org.save();
  }

  const checkout = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appConfig.url}/dashboard/billing?success=1`,
    cancel_url: `${appConfig.url}/dashboard/billing?canceled=1`,
    metadata: {
      organizationId: String(org._id),
      planId: parsed.data.planId,
      interval: parsed.data.interval,
    },
    subscription_data: {
      metadata: {
        organizationId: String(org._id),
        planId: parsed.data.planId,
      },
    },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: checkout.url });
}
