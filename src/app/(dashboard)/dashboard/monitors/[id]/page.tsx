"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Pause,
  Play,
  Trash2,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  IncidentRecord,
  MonitorCheckRecord,
  MonitorRecord,
} from "@/lib/types/api";
import { formatDuration, formatRelativeTime } from "@/lib/utils";

export default function MonitorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [monitor, setMonitor] = useState<MonitorRecord | null>(null);
  const [checks, setChecks] = useState<MonitorCheckRecord[]>([]);
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/monitors/${id}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Monitor not found.");
        return;
      }
      setMonitor(data.monitor);
      setChecks(data.checks ?? []);
      setIncidents(data.incidents ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const chartData = useMemo(() => {
    return [...checks]
      .reverse()
      .filter((c) => c.responseTimeMs != null)
      .map((c) => ({
        time: new Date(c.checkedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        ms: c.responseTimeMs,
      }));
  }, [checks]);

  async function togglePause() {
    if (!monitor) return;
    const isPaused = monitor.status === "paused";
    const res = await fetch(`/api/monitors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isPaused: !isPaused }),
    });
    if (res.ok) await load();
  }

  async function removeMonitor() {
    if (!confirm("Delete this monitor? This cannot be undone.")) return;
    const res = await fetch(`/api/monitors/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) router.push("/dashboard/monitors");
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !monitor) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/monitors">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <p className="text-danger">{error ?? "Not found"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/dashboard/monitors">
          <ArrowLeft className="size-4" />
          Monitors
        </Link>
      </Button>

      <PageHeader
        title={monitor.name}
        description={monitor.url}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={togglePause}>
              {monitor.status === "paused" ? (
                <>
                  <Play className="size-4" /> Resume
                </>
              ) : (
                <>
                  <Pause className="size-4" /> Pause
                </>
              )}
            </Button>
            <Button variant="destructive" size="sm" onClick={removeMonitor}>
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={monitor.status} />
        <span className="text-sm text-muted-foreground uppercase">
          {monitor.type}
        </span>
        {monitor.lastCheckedAt ? (
          <span className="text-sm text-muted-foreground">
            Last check {formatRelativeTime(monitor.lastCheckedAt)}
          </span>
        ) : null}
      </div>

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-base">Response time</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {chartData.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No check data yet. Response times will appear after the first
              successful checks.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="ms" />
                <Tooltip
                  formatter={(v) => [`${v ?? "—"} ms`, "Response"]}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ms"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base">Recent checks</CardTitle>
          </CardHeader>
          <CardContent>
            {checks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No checks recorded.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Response</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checks.slice(0, 10).map((c) => (
                    <TableRow key={c._id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatRelativeTime(c.checkedAt)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={c.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm">
                        {c.responseTimeMs != null
                          ? formatDuration(c.responseTimeMs)
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base">Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            {incidents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No incidents for this monitor.
              </p>
            ) : (
              <ul className="space-y-3">
                {incidents.map((inc) => (
                  <li key={inc._id}>
                    <Link
                      href={`/dashboard/incidents/${inc._id}`}
                      className="block rounded-lg border border-border p-3 hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">
                          #{inc.incidentNumber}
                        </span>
                        <StatusBadge status={inc.status} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {inc.failureReason}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Started {formatRelativeTime(inc.startedAt)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
