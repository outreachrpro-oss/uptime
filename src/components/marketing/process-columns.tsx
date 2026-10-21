import { cn } from "@/lib/utils";

export type ProcessColumn = {
  title: string;
  body: string;
};

type ProcessColumnsProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  columns: ProcessColumn[];
  className?: string;
};

/** Cadvel-style three-column approach strip with hairline dividers. */
export function ProcessColumns({
  eyebrow,
  title,
  description,
  columns,
  className,
}: ProcessColumnsProps) {
  return (
    <section className={cn("border-t border-border bg-white px-4 py-20 sm:px-6", className)}>
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

        <div className="mt-14 grid gap-0 border-t border-border md:grid-cols-3">
          {columns.map((col, i) => (
            <article
              key={col.title}
              className={cn(
                "border-border py-8 md:px-8 md:py-10",
                i === 0 ? "md:pl-0" : "md:border-l",
                i === columns.length - 1 ? "md:pr-0" : ""
              )}
            >
              <h3 className="font-display text-xl text-ink sm:text-2xl">{col.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                {col.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
