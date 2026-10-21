"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type TabbedPanelItem = {
  id: string;
  tab: string;
  number: string;
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
};

type TabbedPanelProps = {
  eyebrow?: string;
  title: string;
  items: TabbedPanelItem[];
  className?: string;
};

/** Cadvel-style horizontal tabs + numbered content panel. */
export function TabbedPanel({
  eyebrow,
  title,
  items,
  className,
}: TabbedPanelProps) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const current = items.find((item) => item.id === active) ?? items[0];

  if (!current) return null;

  return (
    <section className={cn("border-t border-border bg-cream px-4 py-20 sm:px-6", className)}>
      <div className="mx-auto max-w-6xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "font-display max-w-3xl text-3xl leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]",
            eyebrow && "mt-3"
          )}
        >
          {title}
        </h2>

        <div
          role="tablist"
          aria-label={title}
          className="mt-10 flex gap-0 overflow-x-auto border-b border-border"
        >
          {items.map((item) => {
            const selected = item.id === current.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                id={`tab-${item.id}`}
                aria-controls={`panel-${item.id}`}
                onClick={() => setActive(item.id)}
                className={cn(
                  "shrink-0 border-t-2 px-4 py-4 text-left text-sm font-medium transition-colors sm:px-5 sm:text-[15px]",
                  selected
                    ? "border-ink text-ink"
                    : "border-transparent text-muted-foreground hover:text-ink"
                )}
              >
                {item.tab}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="grid gap-8 border-b border-border py-12 lg:grid-cols-[auto_1fr] lg:gap-16"
        >
          <p className="font-display text-5xl tabular-nums text-ink/20 sm:text-6xl">
            {current.number}
          </p>
          <div className="max-w-2xl">
            <h3 className="font-display text-2xl leading-snug text-ink sm:text-3xl">
              {current.title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
              {current.body}
            </p>
            {current.href ? (
              <Link
                href={current.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink underline-offset-4 hover:underline"
              >
                {current.linkLabel ?? "Learn more"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
