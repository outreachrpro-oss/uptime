import { cn } from "@/lib/utils";

type LegalSectionProps = {
  number: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

/** Cadvel-style numbered legal content block. */
export function LegalSection({
  number,
  title,
  children,
  className,
}: LegalSectionProps) {
  return (
    <section
      className={cn(
        "grid gap-4 border-t border-border py-10 first:border-t-0 first:pt-0 sm:grid-cols-[4.5rem_1fr] sm:gap-10 sm:py-12",
        className
      )}
    >
      <p
        className="font-display text-3xl tabular-nums leading-none text-ink/20 sm:text-4xl"
        aria-hidden
      >
        {number}
      </p>
      <div className="min-w-0">
        <h2 className="font-display text-xl tracking-tight text-ink sm:text-2xl">
          {title}
        </h2>
        <div className="legal-body mt-4 space-y-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
          {children}
        </div>
      </div>
    </section>
  );
}
