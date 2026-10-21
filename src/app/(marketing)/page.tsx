import Link from "next/link";
import {
  Bell,
  ChartLine,
  Check,
  Globe,
  Lock,
  Play,
  Server,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { EntryCards } from "@/components/marketing/entry-cards";
import { HeroOrbit } from "@/components/marketing/hero-orbit";
import { ProcessColumns } from "@/components/marketing/process-columns";
import { TabbedPanel } from "@/components/marketing/tabbed-panel";
import { appConfig, plans } from "@/lib/config";
import { formatCurrency } from "@/lib/utils";

const problemTabs = [
  {
    id: "downtime",
    tab: "Late detection",
    number: "01",
    title: "Downtime gets expensive when customers find it first.",
    body: "Background workers check your sites on a schedule — even when the dashboard is closed — and open incidents only after your failure threshold.",
    href: "/features",
    linkLabel: "Website & API monitoring",
  },
  {
    id: "alerts",
    tab: "Missed alerts",
    number: "02",
    title: "The right channel should hear about an outage, not a shared inbox.",
    body: "Email, Slack, Discord, and signed webhooks when a monitor goes down or recovers. SMS when you configure a provider.",
    href: "/features",
    linkLabel: "Alerting & incidents",
  },
  {
    id: "guesswork",
    tab: "Guesswork",
    number: "03",
    title: "Uptime claims without stored checks are just marketing.",
    body: "Uptime and response trends come from real stored checks — never invented live stats on the marketing site.",
    href: "/how-it-works",
    linkLabel: "How monitoring works",
  },
  {
    id: "status",
    tab: "Status silence",
    number: "04",
    title: "Customers should not need a support ticket to check service health.",
    body: "Publish a branded public status page so customers can check service health without opening a support ticket.",
    href: "/features",
    linkLabel: "Public status pages",
  },
];

const faqItems = [
  {
    q: "How does monitoring work?",
    a: "You add a URL, choose an interval, and our always-on worker runs checks in the background. Results are saved to your workspace and power the dashboard.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Starter includes 5 monitors, email alerts, and basic analytics. Pro and Business unlock faster intervals, SSL, status pages, and more.",
  },
  {
    q: "How is uptime calculated?",
    a: "From successful vs failed observations in your retained history. Periods with no data are not treated as proven uptime.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Manage billing in the customer portal when Stripe is configured. See our cancellation policy for details.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — dark Twin-footer ink + orbital pattern / monitoring icons */}
      <section className="relative overflow-hidden bg-[#242017] px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:pt-24">
        <HeroOrbit />
        <div className="relative z-10 mx-auto max-w-3xl text-center animate-fade-up">
          <h1 className="font-display text-[2.35rem] leading-[1.12] text-[#F9F6F0] sm:text-5xl lg:text-[3.4rem]">
            Know when your website goes down — before your customers do.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#F9F6F0]/75 sm:text-lg">
            {appConfig.name} monitors availability 24/7, tracks response time,
            and sends timely alerts from one dashboard.{" "}
            {appConfig.tagline}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/register">Start Monitoring Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-[#F9F6F0]/25 bg-transparent text-[#F9F6F0] hover:bg-[#F9F6F0]/10 hover:text-[#F9F6F0]"
            >
              <Link href="/features">
                <Play className="h-4 w-4" />
                Explore Features
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-[#F9F6F0]/55">
            Free Starter plan · No credit card required to explore
          </p>
        </div>

        <div
          className="relative z-10 mx-auto mt-14 max-w-5xl animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          <DashboardPreview />
        </div>
      </section>

      {/* Cadvel-style tabbed problems */}
      <TabbedPanel
        eyebrow="Four buyer pains"
        title="Four uptime problems we get hired to fix"
        items={problemTabs}
      />

      {/* About strip — asymmetric Cadvel layout */}
      <section className="border-t border-border bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            About us
          </p>
          <div>
            <p className="text-lg leading-relaxed text-ink sm:text-xl">
              {appConfig.name} is uptime monitoring built for teams that need
              reliable checks, clear incidents, and alerts that reach the right
              channel — without invented live stats on a marketing page.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-2">
                <Globe className="h-4 w-4 text-ink" /> HTTP / HTTPS
              </span>
              <span className="inline-flex items-center gap-2">
                <Lock className="h-4 w-4 text-ink" /> SSL certificates
              </span>
              <span className="inline-flex items-center gap-2">
                <Bell className="h-4 w-4 text-ink" /> Multi-channel alerts
              </span>
              <span className="inline-flex items-center gap-2">
                <ChartLine className="h-4 w-4 text-ink" /> Stored check history
              </span>
            </div>
          </div>
        </div>
      </section>

      <ProcessColumns
        eyebrow="Our approach"
        title="We only report what we can measure"
        description="Checks run from outside your network, results are stored, and uptime is calculated from observations — not placeholders."
        columns={[
          {
            title: "Baseline",
            body: "Add a URL, interval, and failure threshold. You get a clear starting point for what “up” means for that endpoint.",
          },
          {
            title: "Signal",
            body: "Workers queue and run probes on schedule. Failures open incidents; recoveries close them with the same audit trail.",
          },
          {
            title: "Proof",
            body: "Dashboards and status pages reflect retained check history. Periods with no data are not treated as proven uptime.",
          },
        ]}
      />

      {/* Capability grid — hairline Cadvel panels */}
      <section className="border-t border-border bg-cream px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
              Monitoring that stays on when you log off
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
              Dedicated workers, Redis queues, and MongoDB history — not browser
              timers.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Globe, title: "HTTP / HTTPS", desc: "Status codes, latency, redirects, timeouts." },
              { icon: Lock, title: "SSL certificates", desc: "Expiry and validity checks on Pro & Business." },
              { icon: Server, title: "TCP ports", desc: "Connection checks with abuse and SSRF controls." },
              { icon: Zap, title: "Keyword checks", desc: "Validate expected content in responses." },
              { icon: Bell, title: "Multi-channel alerts", desc: "Email, Slack, Discord, signed webhooks." },
              { icon: Shield, title: "Secure by design", desc: "Tenant isolation, hashed secrets, SSRF blocking." },
            ].map((f) => (
              <div key={f.title} className="bg-white p-6 sm:p-7">
                <f.icon className="h-5 w-5 text-ink" />
                <h3 className="mt-4 font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/features"
              className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
            >
              Explore all features →
            </Link>
          </div>
        </div>
      </section>

      <EntryCards
        eyebrow="Two ways to start"
        title="Start with one monitor and a clear plan"
        description="Create a free account, add your first endpoint, then expand only when the checks and alerts justify it."
        cards={[
          {
            title: "Free Starter",
            body: "Up to 5 monitors, email alerts, and basic analytics. No credit card required to register and explore the dashboard.",
            href: "/register",
            linkLabel: "Start monitoring free",
          },
          {
            title: "Pro & Business",
            body: "Faster intervals, SSL checks, status pages, and multi-channel alerts when your team outgrows Starter.",
            href: "/pricing",
            linkLabel: "Compare plans",
          },
        ]}
      />

      {/* Pricing */}
      <section className="border-t border-border bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Pricing
            </p>
            <h2 className="font-display mt-3 text-3xl leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
              Simple plans. Real monitoring.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
              Billed in GBP. Start free, upgrade when you need more.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
            {Object.values(plans).map((plan) => {
              const featured = plan.id === "pro";
              return (
                <div
                  key={plan.id}
                  className={
                    featured
                      ? "relative bg-cream p-6 sm:p-8 ring-2 ring-inset ring-ink"
                      : "bg-white p-6 sm:p-8"
                  }
                >
                  {featured && (
                    <span className="mb-4 inline-block rounded-sm bg-yellow px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink">
                      Recommended
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{plan.description}</p>
                  <p className="mt-6 font-display text-4xl text-ink">
                    {plan.priceMonthly === 0
                      ? "Free"
                      : formatCurrency(plan.priceMonthly)}
                    {plan.priceMonthly > 0 && (
                      <span className="ml-1 font-sans text-base font-normal text-muted-foreground">
                        /mo
                      </span>
                    )}
                  </p>
                  <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
                    {plan.features.slice(0, 5).map((f) => (
                      <li key={f} className="flex gap-2 text-sm text-ink-soft">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-8 w-full"
                    variant={featured ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/register">Start free trial</Link>
                  </Button>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    No credit card required to register
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-8">
            <Link
              href="/pricing"
              className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
            >
              See all pricing details →
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-cream px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl leading-[1.15] tracking-tight text-ink sm:text-4xl">
            Questions founders ask before they switch
          </h2>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {faqItems.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="cursor-pointer list-none font-medium text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {item.q}
                    <span className="text-muted-foreground transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
          <p className="mt-8">
            <Link
              href="/faq"
              className="text-sm font-semibold text-ink underline-offset-4 hover:underline"
            >
              Read the full FAQ →
            </Link>
          </p>
        </div>
      </section>

      {/* Final CTA — Cadvel full-bleed dark */}
      <section className="border-t border-ink bg-ink px-4 py-24 text-cream sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl leading-[1.15] sm:text-4xl lg:text-[2.75rem]">
            Start with one costly outage waiting to happen.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
            Create a free account, add your first website, and let the workers
            take it from there.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/register">Start Monitoring Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-cream/20 bg-transparent text-cream hover:bg-cream/10"
            >
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
