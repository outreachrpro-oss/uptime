"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/hooks/use-auth";

import { DashboardTopbar } from "./topbar";
import { DashboardSidebar } from "./sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="hidden w-64 shrink-0 border-r border-border lg:block">
          <Skeleton className="h-full w-full rounded-none" />
        </div>
        <div className="flex flex-1 flex-col">
          <Skeleton className="h-14 w-full rounded-none" />
          <div className="space-y-4 p-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <DashboardSidebar className="fixed inset-y-0 left-0 z-30" />
      </div>
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <DashboardTopbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
