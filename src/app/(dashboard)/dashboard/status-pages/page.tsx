"use client";

import { Globe } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";

export default function StatusPagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Status pages"
        description="Public pages that show uptime to your customers."
      />
      <EmptyState
        icon={Globe}
        title="No status pages"
        description="Upgrade to Pro or Business to publish status pages. None are configured for your organization yet."
      />
    </div>
  );
}
