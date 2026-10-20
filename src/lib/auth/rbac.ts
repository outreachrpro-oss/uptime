import type { SessionPayload } from "./session";

export type Permission =
  | "monitors:read"
  | "monitors:write"
  | "incidents:read"
  | "incidents:write"
  | "alerts:read"
  | "alerts:write"
  | "status:read"
  | "status:write"
  | "reports:read"
  | "reports:write"
  | "team:read"
  | "team:write"
  | "billing:read"
  | "billing:write"
  | "settings:read"
  | "settings:write"
  | "api:manage"
  | "admin:access";

const ORG_PERMISSIONS: Record<
  NonNullable<SessionPayload["orgRole"]>,
  Permission[]
> = {
  org_owner: [
    "monitors:read",
    "monitors:write",
    "incidents:read",
    "incidents:write",
    "alerts:read",
    "alerts:write",
    "status:read",
    "status:write",
    "reports:read",
    "reports:write",
    "team:read",
    "team:write",
    "billing:read",
    "billing:write",
    "settings:read",
    "settings:write",
    "api:manage",
  ],
  org_admin: [
    "monitors:read",
    "monitors:write",
    "incidents:read",
    "incidents:write",
    "alerts:read",
    "alerts:write",
    "status:read",
    "status:write",
    "reports:read",
    "reports:write",
    "team:read",
    "team:write",
    "billing:read",
    "settings:read",
    "settings:write",
    "api:manage",
  ],
  team_member: [
    "monitors:read",
    "monitors:write",
    "incidents:read",
    "incidents:write",
    "alerts:read",
    "status:read",
    "reports:read",
    "team:read",
    "settings:read",
  ],
  viewer: [
    "monitors:read",
    "incidents:read",
    "alerts:read",
    "status:read",
    "reports:read",
    "team:read",
  ],
};

export function hasPermission(
  session: SessionPayload,
  permission: Permission
): boolean {
  if (session.role === "platform_admin") {
    return true;
  }
  if (permission === "admin:access") {
    return false;
  }
  if (!session.orgRole) return false;
  return ORG_PERMISSIONS[session.orgRole]?.includes(permission) ?? false;
}

export function requirePermission(
  session: SessionPayload,
  permission: Permission
): void {
  if (!hasPermission(session, permission)) {
    throw new Error("FORBIDDEN");
  }
}

export function assertSameOrganization(
  session: SessionPayload,
  organizationId: string
): void {
  if (session.role === "platform_admin") return;
  if (session.organizationId !== organizationId) {
    throw new Error("FORBIDDEN");
  }
}
