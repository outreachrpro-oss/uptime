"use client";

import { Bell } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts"
        description="Configure email, Slack, webhooks, and other notification channels."
      />
      <EmptyState
        icon={Bell}
        title="No alert channels yet"
        description="Alert channel APIs are not wired in this build. When enabled, you can route downtime notifications to your team."
      />
    </div>
  );
}
