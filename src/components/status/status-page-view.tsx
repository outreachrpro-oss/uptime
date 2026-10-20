"use client";

import { useEffect, useState } from "react";
import { formatDuration, formatRelativeTime } from "@/lib/utils";

interface StatusData {
  name: string;
  description: string;
  branding: { primaryColor?: string; logoUrl?: string | null };
  overallStatus: string;
  components: Array<{
    id: string;
    displayName: string;
    description?: string;
    group?: string;
    status: string;
    uptimePercent30d: number | null;
    lastCheckedAt: string | null;
  }>;
  incidents: Array<{
    number: number;
    status: string;
    isActive: boolean;
    summary: string;
    startedAt: string;
    resolvedAt: string | null;
    durationMs: number | null;
    updates: Array<{ type: string; message: string; status?: string; at: string }>;
  }>;
}

const statusLabel: Record<string, string> = {
  operational: "All Systems Operational",
  partial_outage: "Partial Outage",
  major_outage: "Major Outage",
  unknown: "Status Unknown",
  up: "Operational",
  down: "Down",
  degraded: "Degraded",
  paused: "Paused",
  pending: "Pending",
};

function statusColor(status: string): string {
  if (status === "operational" || status === "up") return "bg-emerald-500";
  if (status === "partial_outage" || status === "degraded") return "bg-amber-500";
  if (status === "major_outage" || status === "down") return "bg-red-500";
  return "bg-slate-400";
}

export function StatusPageView({ slug }: { slug: string }) {
  const [data, setData] = useState<StatusData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/status/${slug}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load status page");
        }
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Status page not found</h1>
          <p className="mt-2 text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  const primary = data.branding?.primaryColor || "#4F46E5";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-6">
          {data.branding?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.branding.logoUrl} alt="" className="h-8 w-auto" />
          ) : (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold"
              style={{ backgroundColor: primary }}
            >
              {data.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{data.name}</h1>
            {data.description && (
              <p className="text-sm text-slate-500">{data.description}</p>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <div
          className="rounded-xl px-5 py-4 text-white flex items-center gap-3"
          style={{
            backgroundColor:
              data.overallStatus === "operational"
                ? "#10B981"
                : data.overallStatus === "major_outage"
                  ? "#EF4444"
                  : "#F59E0B",
          }}
        >
          <span className="h-3 w-3 rounded-full bg-white/90 animate-pulse" />
          <span className="font-medium text-lg">
            {statusLabel[data.overallStatus] || data.overallStatus}
          </span>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
          {data.components.length === 0 ? (
            <p className="p-6 text-slate-500 text-sm">No services configured on this status page.</p>
          ) : (
            data.components.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="font-medium text-slate-900">{c.displayName}</p>
                  {c.description && (
                    <p className="text-sm text-slate-500">{c.description}</p>
                  )}
                  {c.uptimePercent30d != null && (
                    <p className="text-xs text-slate-400 mt-1">
                      {c.uptimePercent30d}% uptime (30d)
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`h-2.5 w-2.5 rounded-full ${statusColor(c.status)}`} />
                  <span className="text-sm text-slate-700">
                    {statusLabel[c.status] || c.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Incidents</h2>
          {data.incidents.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
              No incidents reported in the last 90 days.
            </div>
          ) : (
            <div className="space-y-3">
              {data.incidents.map((inc) => (
                <article
                  key={inc.number}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">
                        Incident #{inc.number}
                        {inc.isActive ? (
                          <span className="ml-2 text-xs font-medium text-red-600">Active</span>
                        ) : (
                          <span className="ml-2 text-xs font-medium text-emerald-600">Resolved</span>
                        )}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">{inc.summary}</p>
                    </div>
                    <p className="text-xs text-slate-400 shrink-0">
                      {formatRelativeTime(inc.startedAt)}
                    </p>
                  </div>
                  {inc.durationMs != null && (
                    <p className="text-xs text-slate-400 mt-2">
                      Duration: {formatDuration(inc.durationMs)}
                    </p>
                  )}
                  {inc.updates?.length > 0 && (
                    <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                      {inc.updates.map((u, i) => (
                        <li key={i} className="text-sm text-slate-600">
                          <span className="text-xs text-slate-400">
                            {new Date(u.at).toLocaleString("en-GB")}
                          </span>
                          {" — "}
                          {u.message}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <p className="text-center text-xs text-slate-400 pb-8">
          Powered by AROLAGB Uptime · Auto-refreshes every 60 seconds
        </p>
      </main>
    </div>
  );
}
