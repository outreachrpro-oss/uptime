import Link from "next/link";
import {
  Activity,
  Bell,
  FileText,
  Globe,
  Key,
  Layout,
  Server,
  Shield,
  Users,
} from "lucide-react";

import { CtaSection } from "@/components/marketing/cta-section";
import { PageIntro } from "@/components/marketing/page-intro";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/marketing/metadata";

export const metadata = createPageMetadata({
  title: "Features",
  description: `Explore monitoring, alerts, SSL, status pages, and team tools in ${appConfig.name}.`,
  path: "/features",
});

const sections = [
  {
    icon: Globe,
    title: "Website & API monitoring",
    body: "Monitor HTTP and HTTPS endpoints for availability and status codes. Track response times to spot degradation before total failure.",
  },
  {
    icon: Server,
    title: "TCP & infrastructure checks",
    body: "Probe TCP ports for databases, caches, and custom services exposed on the network.",
  },
  {
    icon: Shield,
    title: "SSL certificate monitoring",
    body: "On Pro and Business plans, receive warnings as certificates approach expiry so you can renew on schedule.",
  },
  {
    icon: Activity,
    title: "DNS & keyword checks",
    body: "Validate DNS resolution and optional page content keywords for critical user journeys.",
  },
  {
    icon: Bell,
    title: "Alerting & incidents",
    body: "Email on every plan. Add Slack, Discord, and webhooks on paid tiers. Incidents tie together failed checks and notifications.",
  },
  {
    icon: Layout,
    title: "Public status pages",
    body: "Share component-level status with customers during maintenance or outages (Pro and Business).",
  },
  {
    icon: FileText,
    title: "Reports & exports",
    body: "Generate PDF reports on supported plans for internal reviews or client updates.",
  },
  {
    icon: Key,
    title: "API access",
    body: "Automate monitor management and integrate with your tooling via API on Pro and Business.",
  },
  {
    icon: Users,
    title: "Teams & roles",
    body: "Invite colleagues with role-based access appropriate to your organization size and plan limits.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Product"
        title="Features"
        description={`Everything you need to watch critical endpoints, alert the right people, and explain incidents clearly — in one ${appConfig.name} workspace.`}
      >
        <Button asChild>
          <Link href="/register">Start Monitoring Free</Link>
        </Button>
      </PageIntro>

      <section className="bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {sections.map(({ icon: Icon, title, body }, index) => (
              <article key={title} className="bg-cream p-7 sm:p-8" id={title === "Public status pages" ? "status-pages" : undefined}>
                <p className="font-display text-2xl tabular-nums text-ink/20">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <Icon className="mt-5 size-5 text-ink" />
                <h2 className="mt-4 font-display text-xl text-ink">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{body}</p>
              </article>
            ))}
          </div>
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
