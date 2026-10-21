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
  const year = 2026;

  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
        {/* Cadvel-style manifesto + copyright */}
        <div className="max-w-3xl border-b border-cream/15 pb-12 sm:pb-14">
          <p className="text-[13px] font-medium uppercase leading-relaxed tracking-[0.06em] text-cream/80 sm:text-sm sm:leading-relaxed">
            {appConfig.name} is website uptime monitoring by{" "}
            {companyConfig.legalName}. We start with one endpoint you care about,
            then help you stay ahead of downtime with checks, alerts, and status
            pages.
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.08em] text-cream/45 sm:text-xs">
            © {year} {companyConfig.legalName}. All rights reserved.
          </p>
        </div>

        {/* Cadvel-style column grid with hairline dividers */}
        <nav
          aria-label="Footer navigation"
          className="grid gap-10 py-12 sm:grid-cols-2 sm:gap-0 lg:grid-cols-4"
        >
          <div className="sm:pr-8 lg:border-r lg:border-cream/15 lg:pr-10">
            <h3 className="text-sm text-cream/50">Product</h3>
            <ul className="mt-5 space-y-3">
              {product.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-cream/85 transition-colors hover:text-yellow"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:border-l sm:border-cream/15 sm:pl-8 lg:border-r lg:px-10">
            <h3 className="text-sm text-cream/50">Company</h3>
            <ul className="mt-5 space-y-3">
              {company.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-cream/85 transition-colors hover:text-yellow"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:pr-8 lg:border-r lg:border-cream/15 lg:px-10">
            <h3 className="text-sm text-cream/50">Legal</h3>
            <ul className="mt-5 space-y-3">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-cream/85 transition-colors hover:text-yellow"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:border-l sm:border-cream/15 sm:pl-8 lg:pl-10">
            <h3 className="text-sm text-cream/50">Contact</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={`mailto:${emailConfig.support}`}
                  className="text-sm text-cream/85 transition-colors hover:text-yellow"
                >
                  {emailConfig.support}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${emailConfig.billing}`}
                  className="text-sm text-cream/85 transition-colors hover:text-yellow"
                >
                  {emailConfig.billing}
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-cream/85 transition-colors hover:text-yellow"
                >
                  Contact form
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Cadvel-style bottom bar: logo + company details + policy links */}
        <div className="flex flex-col gap-8 border-t border-cream/15 py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Logo light />
            <div className="space-y-1 text-[11px] leading-relaxed text-cream/45 sm:text-xs">
              <p className="font-medium uppercase tracking-[0.06em] text-cream/60">
                {companyConfig.legalName}
              </p>
              <p>Company Number: {companyConfig.registrationNumber}</p>
              <p>Registered in {companyConfig.jurisdiction}.</p>
              <p>Registered Office: {companyConfig.registeredOffice.full}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.08em] text-cream/50 sm:text-xs">
            <Link href="/privacy" className="hover:text-cream">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="hover:text-cream">
              Cookie Policy
            </Link>
            <Link href="/terms" className="hover:text-cream">
              Terms of Service
            </Link>
            <a
              href={`mailto:${emailConfig.support}`}
              className="hover:text-cream"
            >
              {emailConfig.support}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
