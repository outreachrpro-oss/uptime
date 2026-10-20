import { Activity, Check, Building2, Rocket, X, Zap } from "lucide-react";
import { plans, type PlanId, appConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

const planOrder: PlanId[] = ["starter", "pro", "business"];

const planIcons = {
  starter: Zap,
  pro: Rocket,
  business: Building2,
} as const;

type CellValue = string | number | boolean;

const rows: { label: string; values: CellValue[] }[] = [
  {
    label: "Monitors",
    values: planOrder.map((id) => plans[id].limits.monitors),
  },
  {
    label: "Min. interval",
    values: planOrder.map((id) => `${plans[id].limits.minIntervalSeconds}s`),
  },
  {
    label: "History retention",
    values: planOrder.map((id) => `${plans[id].limits.historyDays} days`),
  },
  {
    label: "Status pages",
    values: planOrder.map((id) => plans[id].limits.statusPages),
  },
  {
    label: "Team members",
    values: planOrder.map((id) => plans[id].limits.teamMembers),
  },
  {
    label: "SSL monitoring",
    values: planOrder.map((id) => plans[id].limits.sslMonitoring),
  },
  {
    label: "Advanced alerts",
    values: planOrder.map((id) => plans[id].limits.advancedAlerts),
  },
  {
    label: "API access",
    values: planOrder.map((id) => plans[id].limits.apiAccess),
  },
  {
    label: "Priority support",
    values: planOrder.map((id) => plans[id].limits.prioritySupport),
  },
];

function CellContent({
  value,
  highlighted,
}: {
  value: CellValue;
  highlighted: boolean;
}) {
  if (typeof value === "boolean") {
    if (value) {
      return (
        <span
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-full",
            highlighted
              ? "bg-[#FFDA40] text-[#1D1B16]"
              : "bg-white/15 text-white"
          )}
          aria-label="Yes"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
      );
    }
    return (
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/40"
        aria-label="No"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "text-sm font-medium",
        highlighted ? "text-white" : "text-white/80"
      )}
    >
      {value}
    </span>
  );
}

/**
 * Twin-style dark comparison table — AROLAGB plan data only.
 */
export function PlanComparison() {
  const highlightedId: PlanId = "pro";

  return (
    <section className="bg-[#242017] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">
            Comparison
          </p>
          <h2 className="font-display mt-3 text-3xl text-white sm:text-4xl">
            {appConfig.name} plans, side by side
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
            Compare limits and capabilities across Starter, Pro, and Business.
            Prices remain illustrative pending client approval.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto">
          <div className="relative min-w-[640px]">
            <div
              className="pointer-events-none absolute bottom-0 top-0 z-0 rounded-2xl border border-[#FFDA40]/90 bg-white/[0.04]"
              style={{
                left: "calc(50% + 0.2rem)",
                width: "calc(25% - 0.4rem)",
              }}
              aria-hidden
            />

            <table className="relative z-10 w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="w-1/4 px-4 pb-6 pt-4 align-bottom">
                    <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
                      Capability
                    </span>
                  </th>
                  {planOrder.map((id) => {
                    const plan = plans[id];
                    const Icon = planIcons[id];
                    const highlighted = id === highlightedId;
                    return (
                      <th
                        key={id}
                        className="w-1/4 px-3 pb-6 pt-4 text-center align-bottom"
                      >
                        <div className="flex flex-col items-center gap-2.5">
                          <span
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-xl",
                              highlighted
                                ? "bg-[#FFDA40] text-[#1D1B16]"
                                : "bg-white/12 text-white"
                            )}
                          >
                            <Icon className="h-4 w-4" strokeWidth={2} />
                          </span>
                          <span
                            className={cn(
                              "text-sm font-semibold",
                              highlighted ? "text-white" : "text-white/85"
                            )}
                          >
                            {plan.name}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={row.label}>
                    <td
                      className={cn(
                        "px-4 py-4 text-sm text-white/75",
                        rowIndex > 0 && "border-t border-white/10"
                      )}
                    >
                      {row.label}
                    </td>
                    {row.values.map((value, i) => {
                      const id = planOrder[i];
                      const highlighted = id === highlightedId;
                      return (
                        <td
                          key={`${row.label}-${id}`}
                          className={cn(
                            "px-3 py-4 text-center",
                            rowIndex > 0 && "border-t border-white/10"
                          )}
                        >
                          <div className="flex justify-center">
                            <CellContent
                              value={value}
                              highlighted={highlighted}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-white/45">
          <Activity className="h-3.5 w-3.5 shrink-0 text-white/45" />
          Limits are enforced in the product when you create monitors and invite
          teammates.
        </p>
      </div>
    </section>
  );
}
