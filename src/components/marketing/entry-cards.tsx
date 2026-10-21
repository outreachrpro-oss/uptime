import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type EntryCard = {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
};

type EntryCardsProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  cards: EntryCard[];
  className?: string;
};

/** Cadvel-style “two entry offers” large panels. */
export function EntryCards({
  eyebrow,
  title,
  description,
  cards,
  className,
}: EntryCardsProps) {
  return (
    <section className={cn("border-t border-border bg-cream-deep/40 px-4 py-20 sm:px-6", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={cn(
              "font-display text-3xl leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]",
              eyebrow && "mt-3"
            )}
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-none border border-border bg-border md:grid-cols-2">
          {cards.map((card) => (
            <article key={card.title} className="bg-white p-8 sm:p-10">
              <h3 className="font-display text-2xl text-ink sm:text-[1.75rem]">
                {card.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
                {card.body}
              </p>
              <Link
                href={card.href}
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink underline-offset-4 hover:underline"
              >
                {card.linkLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
