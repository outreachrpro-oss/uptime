import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  children?: React.ReactNode;
  className?: string;
};

/** Cadvel-style page header for inner marketing pages (not the home hero). */
export function PageIntro({
  eyebrow,
  title,
  description,
  align = "left",
  children,
  className,
}: PageIntroProps) {
  return (
    <section
      className={cn(
        "border-b border-border bg-cream px-4 py-16 sm:px-6 sm:py-20",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-6xl",
          align === "center" && "text-center"
        )}
      >
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "font-display text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl",
            eyebrow && "mt-3"
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
