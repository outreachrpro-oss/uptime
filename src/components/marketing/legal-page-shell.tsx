import Link from "next/link";

import { companyConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

const relatedLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/cancellation-policy", label: "Cancellation Policy" },
] as const;

type LegalPageShellProps = {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
  currentPath?: string;
};

export function LegalPageShell({
  title,
  lastUpdated = "20 October 2025",
  children,
  currentPath,
}: LegalPageShellProps) {
  return (
    <>
      <section className="border-b border-border bg-cream px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Legal
          </p>
          <h1 className="font-display mt-3 text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-base text-ink-soft">
            Last updated: {lastUpdated} · {companyConfig.legalName} (Company No.{" "}
            {companyConfig.registrationNumber})
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <nav
            aria-label="Legal documents"
            className="flex flex-wrap gap-x-1 gap-y-2 border-b border-border pb-8"
          >
            {relatedLinks.map((link) => {
              const active = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-ink text-cream"
                      : "text-ink-soft hover:bg-cream-deep hover:text-ink"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-2">{children}</div>

          <p className="mt-10 border-t border-border pt-8 text-sm text-ink-soft">
            Questions? See our{" "}
            <Link
              href="/contact"
              className="font-medium text-ink underline-offset-4 hover:underline"
            >
              contact page
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
