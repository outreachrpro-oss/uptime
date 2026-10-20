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
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1220] sm:text-4xl">
            Features
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Everything you need to watch critical endpoints, alert the right people,
            and explain incidents clearly — in one {appConfig.name} workspace.
          </p>
          <Button asChild className="mt-6 bg-ink text-cream hover:bg-[#353028]">
            <Link href="/register">Start Monitoring Free</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <Icon className="size-6 text-ink" />
              <h2 className="mt-4 text-lg font-semibold text-[#0B1220]">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <CtaSection />
      </section>
    </>
  );
}
