import Link from "next/link";

import { Button } from "@/components/ui/button";
import { appConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

type CtaSectionProps = {
  className?: string;
  title?: string;
  description?: string;
};

export function CtaSection({
  className,
  title = "Ready to stay ahead of downtime?",
  description = `Create a free account and start monitoring with ${appConfig.name}. Upgrade when you need more capacity and advanced alerts.`,
}: CtaSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border border-ink bg-ink px-6 py-14 text-cream sm:px-10 sm:py-16",
        className
      )}
    >
      <div className="relative max-w-2xl">
        <h2 className="font-display text-2xl leading-[1.15] tracking-tight sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-cream/70 sm:text-base">
          {description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild className="min-w-[200px]">
            <Link href="/register">Start Monitoring Free</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="min-w-[200px] border-cream/25 bg-transparent text-cream hover:bg-cream/10"
          >
            <Link href="/pricing">View pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
