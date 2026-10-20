import Link from "next/link";

import { CtaSection } from "@/components/marketing/cta-section";
import { FaqList } from "@/components/marketing/faq-list";
import { appConfig, emailConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "FAQ",
  description: `Answers about ${appConfig.name} monitoring, billing, alerts, and policies.`,
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1220] sm:text-4xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Search common topics below. For account-specific help, email{" "}
            <a
              href={`mailto:${emailConfig.support}`}
              className="text-ink hover:underline"
            >
              {emailConfig.support}
            </a>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <FaqList searchable />
        <p className="mt-8 text-sm text-slate-600">
          See also our{" "}
          <Link href="/terms" className="text-ink hover:underline">
            Terms
          </Link>
          ,{" "}
          <Link href="/privacy" className="text-ink hover:underline">
            Privacy Policy
          </Link>
          , and{" "}
          <Link href="/refund-policy" className="text-ink hover:underline">
            Refund Policy
          </Link>
          .
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <CtaSection />
      </section>
    </>
  );
}
