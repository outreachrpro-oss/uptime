import { z } from "zod";

export const createMonitorSchema = z.object({
  name: z.string().min(2).max(120),
  url: z.string().url().max(2048),
  type: z.enum(["http", "https", "tcp", "ssl", "dns", "keyword"]),
  intervalSeconds: z.number().int().min(60).max(86400),
  timeoutMs: z.number().int().min(1000).max(60000).default(10000),
  expectedStatus: z.number().int().min(100).max(599).default(200),
  keyword: z.string().max(500).optional().nullable(),
  keywordMode: z.enum(["contains", "not_contains"]).optional().nullable(),
  method: z.enum(["GET", "HEAD", "POST"]).default("GET"),
  port: z.number().int().min(1).max(65535).optional().nullable(),
  failureThreshold: z.number().int().min(1).max(10).default(2),
  recoveryThreshold: z.number().int().min(1).max(10).default(1),
  tags: z.array(z.string().max(40)).max(20).default([]),
  alertChannelIds: z.array(z.string()).default([]),
  followRedirects: z.boolean().default(true),
});

export const updateMonitorSchema = createMonitorSchema.partial().extend({
  isPaused: z.boolean().optional(),
});
