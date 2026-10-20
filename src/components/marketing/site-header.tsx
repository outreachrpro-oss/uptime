"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Pages from the product brief — Home is the logo */
const nav = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="bg-ink text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 text-xs sm:px-6 sm:text-sm">
          <p className="flex min-w-0 items-center gap-2 truncate">
            <span className="shrink-0 rounded-md bg-yellow px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink">
              New
            </span>
            <span className="truncate text-cream/90">
              SSL monitoring & public status pages now on Pro — keep customers informed.
            </span>
          </p>
          <Link
            href="/features"
            className="shrink-0 font-medium text-yellow hover:underline"
          >
            See what&apos;s new
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border/70 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Logo />

          <nav className="absolute left-1/2 hidden max-w-[min(100%,42rem)] -translate-x-1/2 items-center justify-center gap-0.5 lg:flex">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-medium transition xl:px-3 xl:text-sm",
                    active
                      ? "text-ink"
                      : "text-ink-soft hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Start Monitoring Free</Link>
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={cn(
            "border-t border-border bg-cream lg:hidden",
            open ? "block" : "hidden"
          )}
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-cream-deep"
            >
              Home
            </Link>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-cream-deep"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3 sm:hidden">
              <Button variant="outline" asChild>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Log in
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register" onClick={() => setOpen(false)}>
                  Start Monitoring Free
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
