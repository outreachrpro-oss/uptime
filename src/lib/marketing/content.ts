import { appConfig, emailConfig } from "@/lib/config";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "what-is",
    category: "General",
    question: `What is ${appConfig.name}?`,
    answer: `${appConfig.name} is a website and infrastructure monitoring service operated by AROLAGB LIMITED. It checks your endpoints on a schedule, records uptime and response times, and notifies you when something needs attention.`,
  },
  {
    id: "monitor-types",
    category: "Monitoring",
    question: "What can I monitor?",
    answer:
      "You can monitor HTTP/HTTPS endpoints, TCP ports, SSL certificate expiry, DNS resolution, and keyword presence on pages. Availability and performance metrics are stored for review in your dashboard.",
  },
  {
    id: "intervals",
    category: "Monitoring",
    question: "How often are checks performed?",
    answer:
      "Check frequency depends on your plan. The Starter plan uses a 5-minute minimum interval; Pro and Business plans support checks as often as every minute, subject to fair use and system capacity.",
  },
  {
    id: "alerts",
    category: "Alerts",
    question: "How will I be notified?",
    answer:
      "Email alerts are included on all plans. Pro and Business plans add advanced channels such as Slack, Discord, and custom webhooks. You configure channels per monitor or organization.",
  },
  {
    id: "status-pages",
    category: "Status pages",
    question: "Can I publish a public status page?",
    answer:
      "Pro and Business plans include public status pages so you can share incident updates with customers. Starter does not include status pages.",
  },
  {
    id: "data-location",
    category: "Privacy",
    question: "Where is my data stored?",
    answer:
      "Monitoring data is processed and stored to operate the service. Specific hosting regions and subprocessors will be documented in our Privacy Policy and may be updated as infrastructure evolves.",
  },
  {
    id: "free-plan",
    category: "Billing",
    question: "Is there a free plan?",
    answer:
      "Yes. The Starter plan is free and includes core monitoring with limits on monitors, history retention, and features. Paid plans add capacity, faster intervals, SSL monitoring, and team tools.",
  },
  {
    id: "pricing-change",
    category: "Billing",
    question: "Can pricing change?",
    answer:
      "We may update pricing with notice as described in our Terms of Service. Existing subscriptions are handled according to the terms in effect at renewal.",
  },
  {
    id: "cancel",
    category: "Billing",
    question: "How do I cancel?",
    answer:
      "You can cancel paid subscriptions from your account billing settings. Cancellation takes effect at the end of the current billing period unless otherwise stated in our Cancellation Policy.",
  },
  {
    id: "support",
    category: "Support",
    question: "How do I contact support?",
    answer: `Email us at ${emailConfig.support}. Business plan customers may receive priority support when that feature is enabled for their account.`,
  },
  {
    id: "uptime-guarantee",
    category: "General",
    question: "Do you guarantee 100% uptime for the monitoring service?",
    answer:
      "No. Like any online service, our platform may experience maintenance or unexpected outages. We aim to operate reliably but do not guarantee uninterrupted availability of the monitoring service itself.",
  },
];

export const featureHighlights = [
  {
    title: "HTTP & HTTPS monitoring",
    description:
      "Track status codes, response times, and availability from external check locations.",
    icon: "globe" as const,
  },
  {
    title: "SSL certificate tracking",
    description:
      "Get ahead of expiry with certificate checks on supported plans.",
    icon: "shield" as const,
  },
  {
    title: "Multi-channel alerts",
    description:
      "Email on every plan; Slack, Discord, and webhooks on Pro and Business.",
    icon: "bell" as const,
  },
  {
    title: "Status pages",
    description:
      "Communicate incidents clearly with branded public status pages.",
    icon: "layout" as const,
  },
  {
    title: "Team workspaces",
    description:
      "Invite teammates with role-based access as your organization grows.",
    icon: "users" as const,
  },
  {
    title: "Analytics & history",
    description:
      "Review uptime trends and response time charts over your retention window.",
    icon: "chart" as const,
  },
];

export const howItWorksSteps = [
  {
    step: 1,
    title: "Add a monitor",
    description:
      "Enter your URL, hostname, or port. Choose check type, interval, and alert rules.",
  },
  {
    step: 2,
    title: "We check from outside",
    description:
      "Scheduled probes run independently of your infrastructure to detect real user-impacting issues.",
  },
  {
    step: 3,
    title: "Get alerted fast",
    description:
      "When checks fail or thresholds are breached, notifications go to the channels you configured.",
  },
  {
    step: 4,
    title: "Review and improve",
    description:
      "Use dashboards, incident history, and reports to understand patterns and reduce downtime.",
  },
];

export const useCases = [
  {
    title: "SaaS & web apps",
    description:
      "Know when sign-up, API, or app URLs fail before support tickets pile up.",
  },
  {
    title: "E-commerce",
    description:
      "Protect checkout and catalog pages during peak traffic and campaigns.",
  },
  {
    title: "Agencies",
    description:
      "Monitor client sites from one workspace with separate status pages per brand.",
  },
  {
    title: "Internal tools",
    description:
      "Watch staging and production admin panels, webhooks, and microservices.",
  },
];
