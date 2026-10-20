import Link from "next/link";
import { cn } from "@/lib/utils";
import { appConfig } from "@/lib/config";

export function Logo({
  className,
  showText = true,
  href = "/",
  light = false,
}: {
  className?: string;
  showText?: boolean;
  href?: string;
  light?: boolean;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 group", className)}>
      <span
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-lg",
          light ? "bg-yellow text-ink" : "bg-ink text-yellow"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M3 12h2.5l2-6 3 12 2.5-8 2 4H21"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showText && (
        <span
          className={cn(
            "text-[15px] font-semibold tracking-tight",
            light ? "text-cream" : "text-ink group-hover:opacity-80"
          )}
        >
          {appConfig.name}
        </span>
      )}
    </Link>
  );
}
