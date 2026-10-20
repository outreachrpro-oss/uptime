/**
 * Central application configuration.
 * Product name and branding are configurable via environment variables.
 */

export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "AROLAGB Uptime",
  tagline: process.env.NEXT_PUBLIC_APP_TAGLINE || "Monitor Smarter. Stay Online.",
  headline:
    "Know When Your Website Goes Down — Before Your Customers Do.",
  subheadline:
    "Monitor your websites 24/7, detect downtime, track performance, and receive timely alerts — all from one powerful dashboard.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  domain: "arolagblimited.store",
} as const;

export const companyConfig = {
  legalName: process.env.NEXT_PUBLIC_COMPANY_NAME || "AROLAGB LIMITED",
  registrationNumber:
    process.env.NEXT_PUBLIC_COMPANY_NUMBER || "16763224",
  registeredOffice: {
    line1: "31 Crowndale Road",
    city: "London",
    country: "England",
    postcode: "NW1 1TN",
    full:
      process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
      "31 Crowndale Road, London, England, NW1 1TN",
  },
  jurisdiction: "England and Wales",
  companiesHouseUrl:
    "https://find-and-update.company-information.service.gov.uk/company/16763224",
  /** Client confirmation required before production launch */
  operatorConfirmationRequired: true,
  /** Companies House may flag overdue confirmation statement — client must review */
  confirmationStatementReviewRequired: true,
  sicCode: "47910 — Retail sale via mail order houses or via Internet",
} as const;

export const emailConfig = {
  support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@arolagblimited.store",
  info: process.env.NEXT_PUBLIC_INFO_EMAIL || "info@arolagblimited.store",
  billing: process.env.NEXT_PUBLIC_BILLING_EMAIL || "billing@arolagblimited.store",
  contact: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@arolagblimited.store",
  noreply: process.env.NEXT_PUBLIC_NOREPLY_EMAIL || "noreply@arolagblimited.store",
  from:
    process.env.EMAIL_FROM ||
    "AROLAGB Uptime <noreply@arolagblimited.store>",
} as const;

/** Configurable subscription plans (GBP). Subject to client approval. */
export const plans = {
  starter: {
    id: "starter",
    name: "Starter",
    description: "For individuals getting started with uptime monitoring.",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "GBP",
    stripePriceMonthly: null,
    stripePriceYearly: null,
    limits: {
      monitors: 5,
      minIntervalSeconds: 300,
      historyDays: 7,
      statusPages: 0,
      teamMembers: 1,
      sslMonitoring: false,
      advancedAlerts: false,
      pdfReports: false,
      apiAccess: false,
      prioritySupport: false,
    },
    features: [
      "5 website monitors",
      "5-minute monitoring interval",
      "Email alerts",
      "Basic uptime analytics",
      "7-day monitoring history",
      "Basic dashboard",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For growing teams that need faster checks and SSL monitoring.",
    priceMonthly: 12,
    priceYearly: 120,
    currency: "GBP",
    stripePriceMonthly: null as string | null,
    stripePriceYearly: null as string | null,
    limits: {
      monitors: 50,
      minIntervalSeconds: 60,
      historyDays: 90,
      statusPages: 3,
      teamMembers: 5,
      sslMonitoring: true,
      advancedAlerts: true,
      pdfReports: true,
      apiAccess: true,
      prioritySupport: false,
    },
    features: [
      "50 website monitors",
      "1-minute monitoring interval",
      "SSL monitoring",
      "Advanced alerts (Slack, Discord, webhooks)",
      "Public status pages",
      "90-day monitoring history",
      "PDF reports",
      "API access",
    ],
  },
  business: {
    id: "business",
    name: "Business",
    description: "For agencies and businesses that need scale and team management.",
    priceMonthly: 39,
    priceYearly: 390,
    currency: "GBP",
    stripePriceMonthly: null as string | null,
    stripePriceYearly: null as string | null,
    limits: {
      monitors: 250,
      minIntervalSeconds: 60,
      historyDays: 365,
      statusPages: 20,
      teamMembers: 25,
      sslMonitoring: true,
      advancedAlerts: true,
      pdfReports: true,
      apiAccess: true,
      prioritySupport: true,
    },
    features: [
      "250 website monitors",
      "1-minute monitoring interval",
      "Advanced analytics",
      "Team management",
      "Multiple status pages",
      "Advanced alert channels",
      "365-day monitoring history",
      "Priority support",
    ],
  },
} as const;

export type PlanId = keyof typeof plans;

export const roles = [
  "platform_admin",
  "org_owner",
  "org_admin",
  "team_member",
  "viewer",
] as const;

export type Role = (typeof roles)[number];

export const monitorTypes = [
  "http",
  "https",
  "tcp",
  "ssl",
  "dns",
  "keyword",
] as const;

export type MonitorType = (typeof monitorTypes)[number];

export const incidentStatuses = [
  "investigating",
  "identified",
  "monitoring",
  "resolved",
] as const;

export type IncidentStatus = (typeof incidentStatuses)[number];
