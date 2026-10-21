import Link from "next/link";

import { CtaSection } from "@/components/marketing/cta-section";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { PageIntro } from "@/components/marketing/page-intro";
import { ProcessColumns } from "@/components/marketing/process-columns";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/lib/config";
import { howItWorksSteps } from "@/lib/marketing/content";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "How It Works",
  description: `Learn how ${appConfig.name} checks your services and delivers alerts.`,
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <PageIntro
        eyebrow="How it works"
        title="From URL to alert — without guesswork"
        description={`${appConfig.name} runs scheduled checks from outside your network, stores results for analysis, and notifies you when configured conditions are met.`}
      />

      <section className="border-t border-border bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <ol className="divide-y divide-border border-y border-border">
            {howItWorksSteps.map((step) => (
              <li
                key={step.step}
                className="grid gap-6 py-10 sm:grid-cols-[5rem_1fr] sm:gap-12"
              >
                <span className="font-display text-4xl tabular-nums text-ink/20 sm:text-5xl">
                  {String(step.step).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-display text-2xl text-ink sm:text-3xl">
                    {step.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ProcessColumns
        eyebrow="Inside the loop"
        title="You can stop after the first monitor. We designed it that way."
        description="Add one endpoint, confirm checks land, then expand monitors and alert channels only when the signal is useful."
        columns={[
          {
            title: "Add one check",
            body: "Start with a homepage, API, or checkout URL. Set interval and failure threshold before you add the rest of the estate.",
          },
          {
            title: "Decide on evidence",
            body: "Open the dashboard, review stored checks, and confirm alerts fire where your team actually works.",
          },
          {
            title: "Keep the knowledge",
            body: "History, incidents, and configuration stay in your workspace. Upgrade plans when limits — not marketing — require it.",
          },
        ]}
      />

      <section className="border-t border-border bg-cream px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
            Your dashboard
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            Review monitor health, analytics, and incident history in one place.
          </p>
          <DashboardPreview className="mt-10" />
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/register">Start Monitoring Free</Link>
            </Button>
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
