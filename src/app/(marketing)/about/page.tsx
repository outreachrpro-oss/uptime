import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CtaSection } from "@/components/marketing/cta-section";
import { PageIntro } from "@/components/marketing/page-intro";
import { appConfig, companyConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description: `About ${appConfig.name} and ${companyConfig.legalName}.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="Company"
        title={`About ${appConfig.name}`}
        description={appConfig.subheadline}
      />

      <section className="border-t border-border bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-20">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            The product
          </p>
          <div>
            <p className="text-lg leading-relaxed text-ink sm:text-xl">
              {appConfig.name} is a software-as-a-service platform for uptime and
              performance monitoring. Organizations add monitors for websites, APIs,
              and related infrastructure, configure alert channels, and use dashboards
              and optional status pages to stay informed when availability changes.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-cream px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-20">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            The company
          </p>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-ink-soft sm:text-lg">
              {appConfig.name} is operated by {companyConfig.legalName}, a company
              registered in {companyConfig.jurisdiction} (Company No.{" "}
              {companyConfig.registrationNumber}). Registered office:{" "}
              {companyConfig.registeredOffice.full}. Primary activity (SIC):{" "}
              {companyConfig.sicCode}.
            </p>
            <a
              href={companyConfig.companiesHouseUrl}
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View company record on Companies House
              <ArrowUpRight className="h-4 w-4" />
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline-offset-4 hover:underline"
            >
              Contact us
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <CtaSection />
        </div>
      </section>
    </>
  );
}
