"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { IncidentRecord } from "@/lib/types/api";
import { formatRelativeTime } from "@/lib/utils";

function monitorName(incident: IncidentRecord): string | undefined {
  if (typeof incident.monitorId === "object" && incident.monitorId) {
    return incident.monitorId.name;
  }
  return undefined;
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/incidents?limit=50", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = (await res.json()) as { incidents: IncidentRecord[] };
        if (!cancelled) setIncidents(data.incidents ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incidents"
        description="Downtime events across your monitors."
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : incidents.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No incidents"
          description="When a monitor fails, incidents will appear here with timeline and status updates."
        />
      ) : (
        <ul className="space-y-3">
          {incidents.map((inc) => (
            <li key={inc._id}>
              <Link
                href={`/dashboard/incidents/${inc._id}`}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card/50 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    Incident #{inc.incidentNumber}
                    {monitorName(inc) ? (
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        · {monitorName(inc)}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {inc.failureReason}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatRelativeTime(inc.startedAt)}
                    {inc.isActive ? " · Active" : " · Resolved"}
                  </p>
                </div>
                <StatusBadge status={inc.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
