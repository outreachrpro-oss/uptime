"use client";

import { cn } from "@/lib/utils";

/** Product UI preview for marketing pages. */
export function DashboardPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "twin-surface relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-cream-deep/80 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#E8A0A0]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#E8D48A]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#A8D4A8]" />
        <span className="ml-2 text-xs text-muted-foreground">Dashboard</span>
      </div>

      <div className="grid gap-0 md:grid-cols-[190px_1fr]">
        <aside className="hidden border-r border-border bg-cream-deep/40 p-4 md:block">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          {["Overview", "Monitors", "Incidents", "Alerts", "Status Pages"].map(
            (item, i) => (
              <div
                key={item}
                className={cn(
                  "mb-1 rounded-lg px-3 py-2 text-sm",
                  i === 1 ? "bg-ink text-cream" : "text-ink-soft"
                )}
              >
                {item}
              </div>
            )
          )}
        </aside>

        <div className="space-y-4 bg-white p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-success" />
                <h3 className="font-semibold text-ink">your-site.com</h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Up · Checked every 60s
              </p>
            </div>
            <span className="rounded-md bg-yellow/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink">
              Live
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Uptime", value: "99.98%" },
              { label: "Response", value: "142 ms" },
              { label: "Incidents", value: "0" },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-border bg-cream p-3"
              >
                <p className="text-[10px] text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-lg font-semibold text-ink">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-cream p-4">
            <p className="mb-3 text-xs text-muted-foreground">Response time</p>
            <svg viewBox="0 0 400 80" className="h-16 w-full" aria-hidden="true">
              <defs>
                <linearGradient id="areaTwin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFDA40" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#FFDA40" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,50 C40,45 80,55 120,40 C160,25 200,35 240,30 C280,25 320,45 360,35 L400,40 L400,80 L0,80 Z"
                fill="url(#areaTwin)"
              />
              <path
                d="M0,50 C40,45 80,55 120,40 C160,25 200,35 240,30 C280,25 320,45 360,35 L400,40"
                fill="none"
                stroke="#242017"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="space-y-2">
            {["api.your-site.com", "shop.your-site.com", "status.your-site.com"].map(
              (name) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <span className="text-sm text-ink-soft">{name}</span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Up
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
