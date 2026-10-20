"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { appConfig } from "@/lib/config";

interface AdminStats {
  totalUsers: number;
  totalOrganizations: number;
  totalMonitors: number;
  activeIncidents: number;
  activeSubscriptions: number;
  openTickets: number;
  notificationFailures: number;
  revenueRecent: number;
  worker: {
    status: string;
    workerId: string | null;
    lastHeartbeatAt: string | null;
    healthy: boolean;
  };
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Unable to load admin stats");
        }
        return res.json();
      })
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">Platform Admin</p>
          <h1 className="text-xl font-semibold">{appConfig.name}</h1>
        </div>
        <Link href="/dashboard" className="text-sm text-indigo-400 hover:underline">
          ← Back to dashboard
        </Link>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {error && (
          <div className="rounded-xl border border-red-800 bg-red-950/50 p-4 text-red-200">
            {error}
          </div>
        )}
        {!error && !stats && (
          <p className="text-slate-400">Loading platform metrics…</p>
        )}
        {stats && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Users", value: stats.totalUsers },
                { label: "Organizations", value: stats.totalOrganizations },
                { label: "Monitors", value: stats.totalMonitors },
                { label: "Active incidents", value: stats.activeIncidents },
                { label: "Active subscriptions", value: stats.activeSubscriptions },
                { label: "Open tickets", value: stats.openTickets },
                { label: "Failed notifications (24h)", value: stats.notificationFailures },
                {
                  label: "Recent payment volume (minor units)",
                  value: stats.revenueRecent,
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                >
                  <p className="text-xs text-slate-500">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{card.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="font-semibold">Worker health</h2>
              <p className="mt-2 text-sm text-slate-400">
                Status:{" "}
                <span
                  className={
                    stats.worker.healthy ? "text-emerald-400" : "text-amber-400"
                  }
                >
                  {stats.worker.healthy ? "Healthy" : "Unhealthy / unknown"}
                </span>
              </p>
              <p className="text-sm text-slate-400">
                Worker ID: {stats.worker.workerId || "—"}
              </p>
              <p className="text-sm text-slate-400">
                Last heartbeat:{" "}
                {stats.worker.lastHeartbeatAt
                  ? new Date(stats.worker.lastHeartbeatAt).toLocaleString("en-GB")
                  : "Never — start the worker process"}
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
