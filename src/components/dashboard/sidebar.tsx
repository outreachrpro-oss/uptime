"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CreditCard,
  Globe,
  LayoutDashboard,
  Plug,
  Settings,
  Shield,
  Users,
} from "lucide-react";

import { Logo } from "@/components/marketing/logo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/monitors", label: "Monitors", icon: Activity },
  { href: "/dashboard/incidents", label: "Incidents", icon: AlertTriangle },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/status-pages", label: "Status Pages", icon: Globe },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/integrations", label: "Integrations", icon: Plug },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

type SidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

export function DashboardSidebar({ onNavigate, className }: SidebarProps) {
  const pathname = usePathname();
  const { user, organization } = useAuth();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-border bg-[#0B1220] text-slate-100",
        className
      )}
    >
      <div className="border-b border-white/10 px-4 py-5">
        <Logo className="[&_span]:text-white" href="/dashboard" showText />
        {organization ? (
          <p className="mt-3 truncate text-xs text-slate-400">
            {organization.name}
          </p>
        ) : null}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/20 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
        {user?.role === "platform_admin" ? (
          <Link
            href="/admin"
            onClick={onNavigate}
            className={cn(
              "mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith("/admin")
                ? "bg-primary/20 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <Shield className="size-4 shrink-0" aria-hidden />
            Admin
          </Link>
        ) : null}
      </nav>
    </aside>
  );
}
