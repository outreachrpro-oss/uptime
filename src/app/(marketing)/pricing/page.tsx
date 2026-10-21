import { CtaSection } from "@/components/marketing/cta-section";
import { PageIntro } from "@/components/marketing/page-intro";
import { PlanComparison } from "@/components/marketing/plan-comparison";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { appConfig, emailConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "Pricing",
  description: `Compare Starter, Pro, and Business plans for ${appConfig.name}.`,
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <PageIntro
        eyebrow="Pricing"
        title="Choose the plan that matches your monitors"
        description="All prices are shown in GBP. Start free, then upgrade when intervals, SSL, or status pages require it."
        align="center"
      />

      <section className="border-t border-border bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <PricingPlans />
          <p className="mt-10 text-center text-sm text-ink-soft">
            Billing questions? Contact{" "}
            <a
              href={`mailto:${emailConfig.billing}`}
              className="font-medium text-ink underline-offset-4 hover:underline"
            >
              {emailConfig.billing}
            </a>
            .
          </p>
        </div>
      </section>

      <PlanComparison />

      <section className="border-t border-border bg-cream px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <CtaSection
            title="Start with Starter — upgrade anytime"
            description="Create a free account on the Starter plan. Move to Pro or Business when you need faster intervals, SSL monitoring, and status pages."
          />
        </div>
      </section>
    </>
  );
}
