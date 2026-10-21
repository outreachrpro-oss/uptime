import Link from "next/link";

import { CtaSection } from "@/components/marketing/cta-section";
import { FaqList } from "@/components/marketing/faq-list";
import { PageIntro } from "@/components/marketing/page-intro";
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
      <PageIntro
        eyebrow="Support"
        title="Frequently asked questions"
        description={
          <>
            Search common topics below. For account-specific help, email{" "}
            <a
              href={`mailto:${emailConfig.support}`}
              className="font-medium text-ink underline-offset-4 hover:underline"
            >
              {emailConfig.support}
            </a>
            .
          </>
        }
      />

      <section className="border-t border-border bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <FaqList searchable />
          <p className="mt-10 text-sm text-ink-soft">
            See also our{" "}
            <Link href="/terms" className="font-medium text-ink underline-offset-4 hover:underline">
              Terms
            </Link>
            ,{" "}
            <Link href="/privacy" className="font-medium text-ink underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/refund-policy" className="font-medium text-ink underline-offset-4 hover:underline">
              Refund Policy
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-cream px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <CtaSection />
        </div>
      </section>
    </>
  );
}
