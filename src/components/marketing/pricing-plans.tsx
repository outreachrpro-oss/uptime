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
        <div className="inline-flex rounded-full border border-border bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              !yearly ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              yearly ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"
            )}
          >
            Yearly
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Prices are illustrative pending client approval.
        </p>
      </div>

      <div
        className={cn(
          "mt-8 grid gap-6",
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
                "relative flex flex-col border-border bg-white",
                highlighted && "ring-2 ring-ink shadow-lg"
              )}
            >
              {highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 border-0 bg-yellow text-ink">
                  Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
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
                <ul className="space-y-2.5 text-sm text-ink-soft">
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
