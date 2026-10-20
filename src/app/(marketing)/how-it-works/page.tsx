import Link from "next/link";

import { CtaSection } from "@/components/marketing/cta-section";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
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
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1220] sm:text-4xl">
            How it works
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            {appConfig.name} runs scheduled checks from outside your network, stores
            results for analysis, and notifies you when configured conditions are met.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <ol className="space-y-10">
          {howItWorksSteps.map((step) => (
            <li key={step.step} className="flex gap-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-cream text-sm font-bold text-white">
                {step.step}
              </span>
              <div>
                <h2 className="text-xl font-semibold text-[#0B1220]">{step.title}</h2>
                <p className="mt-2 max-w-2xl text-slate-600">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0B1220]">Your dashboard</h2>
          <p className="mt-2 max-w-xl text-slate-600">
            Review monitor health, sample analytics, and incident history in one place.
            Preview below uses demo data only.
          </p>
          <DashboardPreview className="mt-8" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <Button asChild size="lg" className="bg-ink text-cream hover:bg-[#353028]">
          <Link href="/register">Start Monitoring Free</Link>
        </Button>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <CtaSection />
      </section>
    </>
  );
}
