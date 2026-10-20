import Stripe from "stripe";
import { plans, type PlanId } from "@/lib/config";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) {
    // Use account default API version from the Stripe SDK
    stripeClient = new Stripe(key, {
      typescript: true,
    });
  }
  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
}

export function getStripePriceId(
  planId: PlanId,
  interval: "monthly" | "yearly"
): string | null {
  if (planId === "starter") return null;
  const map: Record<string, string | undefined> = {
    "pro:monthly": process.env.STRIPE_PRICE_PRO_MONTHLY,
    "pro:yearly": process.env.STRIPE_PRICE_PRO_YEARLY,
    "business:monthly": process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
    "business:yearly": process.env.STRIPE_PRICE_BUSINESS_YEARLY,
  };
  return map[`${planId}:${interval}`] || plans[planId].stripePriceMonthly || null;
}
