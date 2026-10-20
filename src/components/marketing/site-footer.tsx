import Link from "next/link";
import { Logo } from "./logo";
import { appConfig, companyConfig, emailConfig } from "@/lib/config";

const product = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/login", label: "Dashboard" },
  { href: "/features#status-pages", label: "Status Pages" },
];

const company = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

const legal = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/cancellation-policy", label: "Cancellation Policy" },
];

export function SiteFooter() {
  // Fixed for SSR/client consistency (avoid rare year-boundary hydration noise)
  const year = 2026;

  return (
    <footer className="border-t border-border bg-cream-deep">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              {appConfig.tagline} Website uptime monitoring by{" "}
              {companyConfig.legalName}.
            </p>
            <p className="text-sm text-muted-foreground">
              Support:{" "}
              <a
                href={`mailto:${emailConfig.support}`}
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                {emailConfig.support}
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Product</h3>
            <ul className="mt-3 space-y-2">
              {product.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-soft hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Company</h3>
            <ul className="mt-3 space-y-2">
              {company.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-soft hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Legal</h3>
            <ul className="mt-3 space-y-2">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-soft hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="space-y-1 text-xs leading-relaxed text-muted-foreground">
            <p className="font-medium text-ink-soft">{companyConfig.legalName}</p>
            <p>Company Number: {companyConfig.registrationNumber}</p>
            <p>Registered in {companyConfig.jurisdiction}.</p>
            <p>Registered Office: {companyConfig.registeredOffice.full}</p>
            <p className="pt-3">
              © {year} {companyConfig.legalName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
