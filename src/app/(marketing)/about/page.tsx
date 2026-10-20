import Link from "next/link";

import { CtaSection } from "@/components/marketing/cta-section";
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
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1220] sm:text-4xl">
            About {appConfig.name}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{appConfig.subheadline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-xl font-semibold text-[#0B1220]">The product</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            {appConfig.name} is a software-as-a-service platform for uptime and
            performance monitoring. Organizations add monitors for websites, APIs,
            and related infrastructure, configure alert channels, and use dashboards
            and optional status pages to stay informed when availability changes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#0B1220]">The company</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            {appConfig.name} is operated by {companyConfig.legalName}, a company
            registered in {companyConfig.jurisdiction} (Company No.{" "}
            {companyConfig.registrationNumber}). Registered office:{" "}
            {companyConfig.registeredOffice.full}. Primary activity (SIC):{" "}
            {companyConfig.sicCode}.
          </p>
          <p className="mt-3 leading-relaxed text-slate-600">
            <a
              href={companyConfig.companiesHouseUrl}
              className="text-ink hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View company record on Companies House
            </a>
          </p>
        </div>

        {companyConfig.operatorConfirmationRequired && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
            <strong>Operator confirmation required.</strong> Production launch and
            certain billing or compliance steps require explicit confirmation from
            the operator before this service is offered to paying customers at scale.
          </div>
        )}

        {companyConfig.confirmationStatementReviewRequired && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
            Companies House filings (including confirmation statements) should be
            reviewed by the client to ensure records remain accurate and up to date.
          </div>
        )}

        <p className="text-sm text-slate-600">
          We do not publish customer counts, awards, or testimonials on this site
          unless they are verified and approved for display.
        </p>

        <p>
          <Link href="/contact" className="text-ink hover:underline">
            Contact us →
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <CtaSection />
      </section>
    </>
  );
}
