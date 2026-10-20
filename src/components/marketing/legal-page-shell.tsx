import Link from "next/link";

import { companyConfig } from "@/lib/config";

type LegalPageShellProps = {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
};

export function LegalPageShell({
  title,
  lastUpdated = "20 October 2025",
  children,
}: LegalPageShellProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Subject to legal review.</strong> This draft is provided for
        website launch purposes and must be reviewed by qualified advisers before
        reliance in production.
      </p>
      <header className="mt-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#0B1220]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Last updated: {lastUpdated} · {companyConfig.legalName} (Company No.{" "}
          {companyConfig.registrationNumber})
        </p>
      </header>
      <div className="prose prose-slate mt-8 max-w-none prose-headings:scroll-mt-24 prose-a:text-ink">
        {children}
      </div>
      <p className="mt-12 text-sm text-slate-600">
        Questions? See our{" "}
        <Link href="/contact" className="text-ink hover:underline">
          contact page
        </Link>
        .
      </p>
    </article>
  );
}
