import Link from "next/link";
import {
  Activity,
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
import { HeroOrbit } from "@/components/marketing/hero-orbit";
import { appConfig, plans } from "@/lib/config";
import { formatCurrency } from "@/lib/utils";

const useCases = [
  {
    title: "Catch downtime before customers do",
    body: "Background workers check your sites on a schedule — even when the dashboard is closed — and open incidents only after your failure threshold.",
    icon: Activity,
  },
  {
    title: "Alert the right channel, fast",
    body: "Email, Slack, Discord, and signed webhooks when a monitor goes down or recovers. SMS when you configure a provider.",
    icon: Bell,
  },
  {
    title: "See performance, not guesswork",
    body: "Uptime and response trends come from real stored checks — never invented live stats on the marketing site.",
    icon: ChartLine,
  },
  {
    title: "Share a calm status page",
    body: "Publish a branded public status page so customers can check service health without opening a support ticket.",
    icon: Globe,
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

      {/* Use cases — Twin “every job” style */}
      <section className="border-t border-border bg-cream-deep/50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Use cases
          </p>
          <h2 className="font-display mx-auto mt-2 max-w-2xl text-center text-3xl text-ink sm:text-4xl">
            Every check you need, done for you
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {useCases.map((item) => (
              <article
                key={item.title}
                className="twin-surface rounded-2xl p-6 sm:p-8"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow text-ink">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Feature strip with product cards */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              Monitoring that stays on when you log off
            </h2>
            <p className="mt-3 text-ink-soft">
              Dedicated workers, Redis queues, and MongoDB history — not browser
              timers.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Globe, title: "HTTP / HTTPS", desc: "Status codes, latency, redirects, timeouts." },
              { icon: Lock, title: "SSL certificates", desc: "Expiry and validity checks on Pro & Business." },
              { icon: Server, title: "TCP ports", desc: "Connection checks with abuse and SSRF controls." },
              { icon: Zap, title: "Keyword checks", desc: "Validate expected content in responses." },
              { icon: Bell, title: "Multi-channel alerts", desc: "Email, Slack, Discord, signed webhooks." },
              { icon: Shield, title: "Secure by design", desc: "Tenant isolation, hashed secrets, SSRF blocking." },
            ].map((f) => (
              <div
                key={f.title}
                className="flex gap-4 rounded-2xl border border-border bg-white p-5"
              >
                <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-ink" />
                <div>
                  <h3 className="font-semibold text-ink">{f.title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/features"
              className="text-sm font-medium text-ink underline-offset-4 hover:underline"
            >
              Explore all features →
            </Link>
          </div>
        </div>
      </section>

      {/* Prompt-style CTA band like Twin “What should Twin do first?” */}
      <section className="border-y border-border bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            What should we monitor first?
          </h2>
          <p className="mt-3 text-ink-soft">
            Add your homepage, API, or checkout — then configure alerts in minutes.
          </p>
          <div className="twin-surface mt-8 flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center">
            <div className="flex-1 rounded-xl bg-cream px-4 py-3 text-left text-sm text-ink-soft">
              Monitor https://your-site.com every 60 seconds and alert my team…
            </div>
            <Button asChild className="shrink-0">
              <Link href="/register">Start free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing — Twin card style */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Pricing
          </p>
          <h2 className="font-display mx-auto mt-2 max-w-2xl text-center text-3xl text-ink sm:text-4xl">
            Simple plans. Real monitoring.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-ink-soft">
            Illustrative GBP pricing — subject to client approval.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {Object.values(plans).map((plan) => {
              const featured = plan.id === "pro";
              return (
                <div
                  key={plan.id}
                  className={
                    featured
                      ? "twin-surface relative rounded-2xl p-6 ring-2 ring-ink"
                      : "rounded-2xl border border-border bg-white p-6"
                  }
                >
                  {featured && (
                    <span className="absolute -top-3 left-6 rounded-full bg-yellow px-2.5 py-0.5 text-[11px] font-semibold text-ink">
                      Recommended
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{plan.description}</p>
                  <p className="mt-5 font-display text-4xl text-ink">
                    {plan.priceMonthly === 0
                      ? "Free"
                      : formatCurrency(plan.priceMonthly)}
                    {plan.priceMonthly > 0 && (
                      <span className="ml-1 font-sans text-base font-normal text-muted-foreground">
                        /mo
                      </span>
                    )}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {plan.features.slice(0, 5).map((f) => (
                      <li key={f} className="flex gap-2 text-sm text-ink-soft">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-6 w-full"
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
          <p className="mt-6 text-center">
            <Link
              href="/pricing"
              className="text-sm font-medium text-ink underline-offset-4 hover:underline"
            >
              See all pricing details →
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-cream-deep/40 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-center text-3xl text-ink sm:text-4xl">
            Questions founders ask before they switch
          </h2>
          <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-white">
            {faqItems.map((item) => (
              <details key={item.q} className="group px-5 py-4">
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
          <p className="mt-6 text-center">
            <Link
              href="/faq"
              className="text-sm font-medium text-ink underline-offset-4 hover:underline"
            >
              Read the full FAQ →
            </Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ink px-4 py-20 text-cream sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl sm:text-4xl">
            Monitor smarter. Stay online.
          </h2>
          <p className="mt-4 text-cream/75">
            Create a free account, add your first website, and let the workers
            take it from there.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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
