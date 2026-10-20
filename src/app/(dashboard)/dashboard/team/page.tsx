"use client";

import { Users } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { useAuth } from "@/lib/hooks/use-auth";

export default function TeamPage() {
  const { user, organization } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description={
          organization
            ? `Members of ${organization.name}`
            : "Invite teammates to your organization."
        }
      />
      {user ? (
        <div className="rounded-xl border border-border bg-card/50 p-4 text-sm">
          <p className="font-medium">{user.name}</p>
          <p className="text-muted-foreground">{user.email}</p>
          {user.orgRole ? (
            <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
              Role: {user.orgRole.replace(/_/g, " ")}
            </p>
          ) : null}
        </div>
      ) : null}
      <EmptyState
        icon={Users}
        title="Team management coming soon"
        description="Invite flows and member lists will use organization APIs when available. You are the only member shown from your session."
      />
    </div>
  );
}
