import { CtaSection } from "@/components/marketing/cta-section";
import { PlanComparison } from "@/components/marketing/plan-comparison";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { appConfig, emailConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "Pricing",
  description: `Compare Starter, Pro, and Business plans for ${appConfig.name}. Prices are illustrative pending client approval.`,
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-border py-14">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
            Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">
            Choose a plan that matches your monitor count and alert needs. All
            prices are shown in GBP and are illustrative until confirmed by the
            operator.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <PricingPlans />
        <p className="mt-8 text-center text-sm text-ink-soft">
          Billing questions? Contact{" "}
          <a
            href={`mailto:${emailConfig.billing}`}
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            {emailConfig.billing}
          </a>
          .
        </p>
      </section>

      {/* Twin-style dark comparison — AROLAGB plan data */}
      <PlanComparison />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <CtaSection
          title="Start with Starter — upgrade anytime"
          description="Create a free account on the Starter plan. Move to Pro or Business when you need faster intervals, SSL monitoring, and status pages."
        />
      </section>
    </>
  );
}
