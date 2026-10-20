"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Activity, Plus, Search } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MonitorRecord } from "@/lib/types/api";
import { formatRelativeTime } from "@/lib/utils";

export default function MonitorsListPage() {
  const [monitors, setMonitors] = useState<MonitorRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status !== "all") params.set("status", status);
      const res = await fetch(`/api/monitors?${params}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setMonitors(data.monitors ?? []);
        setTotal(data.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [q, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => setQ(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitors"
        description={`${total} monitor${total === 1 ? "" : "s"} in your organization.`}
        actions={
          <Button asChild>
            <Link href="/dashboard/monitors/new">
              <Plus className="size-4" />
              Add monitor
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or URL…"
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="up">Up</SelectItem>
            <SelectItem value="down">Down</SelectItem>
            <SelectItem value="degraded">Degraded</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : monitors.length === 0 ? (
        <EmptyState
          icon={Activity}
          title={q || status !== "all" ? "No matches" : "No monitors yet"}
          description={
            q || status !== "all"
              ? "Try adjusting your search or filters."
              : "Add a monitor to start tracking uptime."
          }
          action={
            !q && status === "all" ? (
              <Button asChild>
                <Link href="/dashboard/monitors/new">Add monitor</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden lg:table-cell">Interval</TableHead>
                <TableHead className="hidden sm:table-cell">Last check</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monitors.map((m) => (
                <TableRow key={m._id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/monitors/${m._id}`}
                      className="font-medium hover:text-primary"
                    >
                      {m.name}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground max-w-xs">
                      {m.url}
                    </p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={m.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell uppercase text-xs text-muted-foreground">
                    {m.type}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {Math.round(m.intervalSeconds / 60)}m
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {m.lastCheckedAt
                      ? formatRelativeTime(m.lastCheckedAt)
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
