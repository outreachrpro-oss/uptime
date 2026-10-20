"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Plus,
  XCircle,
} from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
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
import { formatRelativeTime } from "@/lib/utils";
import type { MonitorRecord } from "@/lib/types/api";

export default function DashboardOverviewPage() {
  const [monitors, setMonitors] = useState<MonitorRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/monitors?limit=50", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setMonitors(data.monitors ?? []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const total = monitors.length;
    const up = monitors.filter((m) => m.status === "up").length;
    const down = monitors.filter((m) => m.status === "down").length;
    const degraded = monitors.filter((m) =>
      ["degraded", "unknown", "pending"].includes(m.status)
    ).length;
    return { total, up, down, degraded };
  }, [monitors]);

  const recent = monitors.slice(0, 8);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Real-time status across your monitors."
        actions={
          <Button asChild>
            <Link href="/dashboard/monitors/new">
              <Plus className="size-4" />
              Add monitor
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total monitors"
          value={stats.total}
          icon={Activity}
          loading={loading}
        />
        <StatCard
          title="Up"
          value={stats.up}
          icon={CheckCircle2}
          subtitle="Currently healthy"
          loading={loading}
        />
        <StatCard
          title="Down"
          value={stats.down}
          icon={XCircle}
          subtitle="Needs attention"
          loading={loading}
        />
        <StatCard
          title="Other"
          value={stats.degraded}
          icon={AlertTriangle}
          subtitle="Pending or degraded"
          loading={loading}
        />
      </div>

      <Card className="border-border/80">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Monitors</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/monitors">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : monitors.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No monitors yet"
              description="Create your first monitor to start tracking uptime and response times."
              action={
                <Button asChild>
                  <Link href="/dashboard/monitors/new">Add your first monitor</Link>
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Last check</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">
                    Response
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((m) => (
                  <TableRow key={m._id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/monitors/${m._id}`}
                        className="font-medium hover:text-primary"
                      >
                        {m.name}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground max-w-[200px] sm:max-w-xs">
                        {m.url}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={m.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {m.lastCheckedAt
                        ? formatRelativeTime(m.lastCheckedAt)
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-right tabular-nums text-sm">
                      {m.lastResponseTimeMs != null
                        ? `${m.lastResponseTimeMs}ms`
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
