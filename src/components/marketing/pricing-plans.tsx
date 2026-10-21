"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { plans, type PlanId } from "@/lib/config";
import { cn } from "@/lib/utils";

const planOrder: PlanId[] = ["starter", "pro", "business"];

function formatPrice(amount: number, currency: string) {
  if (amount === 0) return "Free";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

type PricingPlansProps = {
  compact?: boolean;
};

export function PricingPlans({ compact }: PricingPlansProps) {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <div className="inline-flex border border-border bg-cream p-1">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium transition-colors",
              !yearly ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium transition-colors",
              yearly ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"
            )}
          >
            Yearly
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Billed in GBP. Cancel anytime from billing settings.
        </p>
      </div>

      <div
        className={cn(
          "mt-10 grid gap-px overflow-hidden border border-border bg-border",
          compact ? "md:grid-cols-3" : "lg:grid-cols-3"
        )}
      >
        {planOrder.map((id) => {
          const plan = plans[id];
          const price = yearly ? plan.priceYearly : plan.priceMonthly;
          const period = yearly ? "/year" : "/month";
          const highlighted = id === "pro";

          return (
            <Card
              key={id}
              className={cn(
                "relative flex flex-col rounded-none border-0 shadow-none",
                highlighted ? "bg-cream ring-2 ring-inset ring-ink" : "bg-white"
              )}
            >
              {highlighted && (
                <Badge className="absolute left-6 top-6 rounded-sm border-0 bg-yellow text-ink">
                  Popular
                </Badge>
              )}
              <CardHeader className={cn(highlighted && "pt-14")}>
                <CardTitle className="text-ink">{plan.name}</CardTitle>
                <CardDescription className="text-ink-soft">
                  {plan.description}
                </CardDescription>
                <p className="font-display pt-2 text-3xl text-ink">
                  {formatPrice(price, plan.currency)}
                  {price > 0 && (
                    <span className="font-sans text-base font-normal text-muted-foreground">
                      {period}
                    </span>
                  )}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2.5 border-t border-border pt-5 text-sm text-ink-soft">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-ink" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full"
                  variant={highlighted ? "default" : "outline"}
                >
                  <Link href="/register">
                    {id === "starter" ? "Get started free" : "Start trial"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

    </div>
  );
}
