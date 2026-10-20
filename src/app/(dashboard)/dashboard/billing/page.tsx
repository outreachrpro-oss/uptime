"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Check, CreditCard } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { plans, type PlanId } from "@/lib/config";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn, formatCurrency } from "@/lib/utils";

function BillingContent() {
  const { organization } = useAuth();
  const searchParams = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const currentPlanId = (organization?.planId as PlanId) || "starter";
  const currentPlan = plans[currentPlanId];

  const banner =
    searchParams.get("success") === "1"
      ? "Subscription updated successfully."
      : searchParams.get("canceled") === "1"
        ? "Checkout was canceled."
        : null;

  async function startCheckout(planId: "pro" | "business", interval: "monthly" | "yearly") {
    setMessage(null);
    setLoadingPlan(`${planId}-${interval}`);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ planId, interval }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(
          data.error ||
            "Checkout unavailable. Stripe may not be configured for this environment."
        );
        return;
      }
      if (data.url) window.location.href = data.url;
    } catch {
      setMessage("Could not start checkout.");
    } finally {
      setLoadingPlan(null);
    }
  }

  async function openPortal() {
    setMessage(null);
    setPortalLoading(true);
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Billing portal unavailable.");
        return;
      }
      if (data.url) window.location.href = data.url;
    } catch {
      setMessage("Could not open billing portal.");
    } finally {
      setPortalLoading(false);
    }
  }

  const planEntries = Object.values(plans);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing"
        description="Manage your subscription and plan limits."
        actions={
          <Button
            variant="outline"
            size="sm"
            disabled={portalLoading}
            onClick={openPortal}
          >
            <CreditCard className="size-4" />
            {portalLoading ? "Opening…" : "Manage billing"}
          </Button>
        }
      />

      {(banner || message) && (
        <p
          className={cn(
            "rounded-lg border px-3 py-2 text-sm",
            message && !banner
              ? "border-warning/30 bg-warning/10 text-warning-foreground"
              : "border-success/30 bg-success/10 text-success"
          )}
        >
          {banner ?? message}
        </p>
      )}

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Current plan</CardTitle>
          <CardDescription>
            {organization?.subscriptionStatus
              ? `Status: ${organization.subscriptionStatus}`
              : "Subscription status from your organization record."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{currentPlan.name}</p>
          <p className="text-sm text-muted-foreground">
            Up to {currentPlan.limits.monitors} monitors ·{" "}
            {currentPlan.limits.minIntervalSeconds}s minimum interval
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {planEntries.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          return (
            <Card
              key={plan.id}
              className={cn(
                "flex flex-col border-border/80",
                isCurrent && "ring-2 ring-primary"
              )}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <p className="pt-2 text-3xl font-bold">
                  {formatCurrency(plan.priceMonthly, plan.currency)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /mo
                  </span>
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="size-4 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {isCurrent ? (
                  <Button className="w-full" disabled variant="secondary">
                    Current plan
                  </Button>
                ) : plan.id === "starter" ? (
                  <Button className="w-full" disabled variant="outline">
                    Free tier
                  </Button>
                ) : (
                  <>
                    <Button
                      className="w-full"
                      disabled={!!loadingPlan}
                      onClick={() =>
                        startCheckout(plan.id as "pro" | "business", "monthly")
                      }
                    >
                      {loadingPlan === `${plan.id}-monthly`
                        ? "Redirecting…"
                        : "Subscribe monthly"}
                    </Button>
                    <Button
                      className="w-full"
                      variant="outline"
                      disabled={!!loadingPlan}
                      onClick={() =>
                        startCheckout(plan.id as "pro" | "business", "yearly")
                      }
                    >
                      {loadingPlan === `${plan.id}-yearly`
                        ? "Redirecting…"
                        : "Subscribe yearly"}
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
      <BillingContent />
    </Suspense>
  );
}
