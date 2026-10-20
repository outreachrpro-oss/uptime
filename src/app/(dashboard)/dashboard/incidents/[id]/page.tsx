"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { IncidentRecord } from "@/lib/types/api";
import { formatDuration, formatRelativeTime } from "@/lib/utils";

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<IncidentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch(`/api/incidents/${id}`, { credentials: "include" });
    if (!res.ok) {
      setNotFound(true);
      return;
    }
    const data = (await res.json()) as { incident: IncidentRecord };
    setIncident(data.incident);
    setNotes(data.incident.notes || "");
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function acknowledge() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acknowledge: true }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to acknowledge");
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to acknowledge");
    } finally {
      setSaving(false);
    }
  }

  async function saveNotes() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save notes");
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save notes");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  if (notFound || !incident) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/incidents">
            <ArrowLeft className="size-4" />
            Incidents
          </Link>
        </Button>
        <p className="text-muted-foreground">Incident not found.</p>
      </div>
    );
  }

  const monitor =
    typeof incident.monitorId === "object" ? incident.monitorId : null;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/dashboard/incidents">
          <ArrowLeft className="size-4" />
          Incidents
        </Link>
      </Button>

      <PageHeader
        title={`Incident #${incident.incidentNumber}`}
        description={incident.failureReason}
      />

      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={incident.status} />
        <span className="text-sm text-muted-foreground">
          Started {formatRelativeTime(incident.startedAt)}
        </span>
        {incident.durationMs != null && (
          <span className="text-sm text-muted-foreground">
            Duration {formatDuration(incident.durationMs)}
          </span>
        )}
        {incident.isActive && (
          <Button size="sm" variant="outline" disabled={saving} onClick={acknowledge}>
            Acknowledge
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      {monitor && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monitor</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href={`/dashboard/monitors/${monitor._id}`}
              className="text-indigo-600 hover:underline dark:text-indigo-400"
            >
              {monitor.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{monitor.url}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            className="min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add an internal note…"
          />
          <Button size="sm" disabled={saving} onClick={saveNotes}>
            Save notes
          </Button>
        </CardContent>
      </Card>

      {incident.events && incident.events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {incident.events.map((event, i) => (
                <li key={i} className="border-l-2 border-indigo-500/40 pl-3 text-sm">
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.createdAt).toLocaleString("en-GB")} · {event.type}
                  </p>
                  <p className="mt-0.5">{event.message}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
