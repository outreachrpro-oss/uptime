"use client";

import { Plug } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Connect Slack, Discord, PagerDuty, and custom webhooks."
      />
      <EmptyState
        icon={Plug}
        title="No integrations connected"
        description="Integration setup will appear here when alert channel APIs are available."
      />
    </div>
  );
}
