"use client";

import { BarChart3 } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Export uptime summaries and SLA reports."
      />
      <EmptyState
        icon={BarChart3}
        title="No reports generated"
        description="PDF and scheduled reports will appear here once you have monitoring history and report APIs are enabled."
      />
    </div>
  );
}
