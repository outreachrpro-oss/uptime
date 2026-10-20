import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Organization } from "@/lib/db/models/Organization";
import { Subscription, Payment, StripeWebhookEvent } from "@/lib/db/models/Subscription";
import { getStripe } from "@/lib/stripe/client";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 503 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  await connectDB();

  // Idempotent processing
  try {
    await StripeWebhookEvent.create({
      stripeEventId: event.id,
      type: event.type,
    });
  } catch {
    return NextResponse.json({ received: true, duplicate: true });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const organizationId = session.metadata?.organizationId;
      const planId = session.metadata?.planId || "pro";
      if (organizationId && session.subscription) {
        await Organization.findByIdAndUpdate(organizationId, {
          planId,
          stripeSubscriptionId: String(session.subscription),
          subscriptionStatus: "active",
          billingInterval: session.metadata?.interval || "monthly",
        });
        await Subscription.findOneAndUpdate(
          { organizationId },
          {
            organizationId,
            planId,
            stripeCustomerId: String(session.customer),
            stripeSubscriptionId: String(session.subscription),
            status: "active",
            interval: session.metadata?.interval || "monthly",
          },
          { upsert: true }
        );
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const organizationId = sub.metadata?.organizationId;
      if (organizationId) {
        const status = sub.status;
        const isCanceled = event.type === "customer.subscription.deleted";
        // Stripe typings vary by API version — read period end safely
        const periodEndUnix =
          (sub as unknown as { current_period_end?: number }).current_period_end ??
          null;
        const currentPeriodEnd = periodEndUnix
          ? new Date(periodEndUnix * 1000)
          : null;
        await Organization.findByIdAndUpdate(organizationId, {
          subscriptionStatus: isCanceled ? "canceled" : status,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          currentPeriodEnd,
          // Do NOT delete monitors on downgrade/cancel — keep data, enforce limits on create
          ...(isCanceled ? { planId: "starter" } : {}),
        });
        await Subscription.findOneAndUpdate(
          { organizationId },
          {
            status: isCanceled ? "canceled" : status,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            currentPeriodEnd,
            ...(isCanceled
              ? { planId: "starter", canceledAt: new Date() }
              : {}),
          }
        );
      }
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = String(invoice.customer);
      const org = await Organization.findOne({ stripeCustomerId: customerId });
      if (org && invoice.id) {
        await Payment.findOneAndUpdate(
          { stripeInvoiceId: invoice.id },
          {
            organizationId: org._id,
            stripeInvoiceId: invoice.id,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: "succeeded",
            description: invoice.lines?.data?.[0]?.description || "Subscription",
            paidAt: new Date(),
          },
          { upsert: true }
        );
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = String(invoice.customer);
      await Organization.findOneAndUpdate(
        { stripeCustomerId: customerId },
        { subscriptionStatus: "past_due" }
      );
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
