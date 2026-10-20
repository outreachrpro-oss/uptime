export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified?: boolean;
  orgRole?: string;
};

export type AuthOrganization = {
  _id: string;
  name: string;
  slug: string;
  planId: string;
  subscriptionStatus?: string;
};

export type MonitorRecord = {
  _id: string;
  name: string;
  url: string;
  type: string;
  status: string;
  intervalSeconds: number;
  lastCheckedAt?: string | null;
  lastResponseTimeMs?: number | null;
  lastError?: string | null;
  uptimePercent24h?: number | null;
  uptimePercent7d?: number | null;
  isPaused?: boolean;
  createdAt?: string;
};

export type MonitorCheckRecord = {
  _id: string;
  status: string;
  responseTimeMs?: number | null;
  statusCode?: number | null;
  errorMessage?: string | null;
  checkedAt: string;
};

export type IncidentRecord = {
  _id: string;
  incidentNumber: number;
  status: string;
  failureReason: string;
  isActive: boolean;
  startedAt: string;
  resolvedAt?: string | null;
  durationMs?: number | null;
  notes?: string;
  monitorId:
    | string
    | {
        _id: string;
        name: string;
        url: string;
        status?: string;
      };
  events?: Array<{
    type: string;
    message: string;
    status?: string | null;
    createdAt: string;
  }>;
};
