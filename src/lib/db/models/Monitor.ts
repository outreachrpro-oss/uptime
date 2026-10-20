import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const MaintenanceWindowSchema = new Schema(
  {
    name: { type: String, required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    recurring: { type: Boolean, default: false },
    timezone: { type: String, default: "Europe/London" },
  },
  { _id: true }
);

const MonitorSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    url: { type: String, required: true, trim: true },
    host: { type: String, default: null },
    port: { type: Number, default: null, min: 1, max: 65535 },
    type: {
      type: String,
      enum: ["http", "https", "tcp", "ssl", "dns", "keyword"],
      required: true,
      index: true,
    },
    intervalSeconds: {
      type: Number,
      required: true,
      min: 60,
      default: 300,
    },
    timeoutMs: { type: Number, default: 10000, min: 1000, max: 60000 },
    expectedStatus: { type: Number, default: 200 },
    keyword: { type: String, default: null },
    keywordMode: {
      type: String,
      enum: ["contains", "not_contains", null],
      default: null,
    },
    method: {
      type: String,
      enum: ["GET", "HEAD", "POST"],
      default: "GET",
    },
    headers: { type: Map, of: String, default: {} },
    followRedirects: { type: Boolean, default: true },
    failureThreshold: { type: Number, default: 2, min: 1, max: 10 },
    recoveryThreshold: { type: Number, default: 1, min: 1, max: 10 },
    consecutiveFailures: { type: Number, default: 0 },
    consecutiveSuccesses: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["up", "down", "degraded", "paused", "pending", "unknown"],
      default: "pending",
      index: true,
    },
    lastCheckedAt: { type: Date, default: null },
    lastStatusChangeAt: { type: Date, default: null },
    lastResponseTimeMs: { type: Number, default: null },
    lastError: { type: String, default: null },
    nextCheckAt: { type: Date, default: Date.now, index: true },
    uptimePercent24h: { type: Number, default: null },
    uptimePercent7d: { type: Number, default: null },
    uptimePercent30d: { type: Number, default: null },
    sslExpiresAt: { type: Date, default: null },
    sslIssuer: { type: String, default: null },
    sslValid: { type: Boolean, default: null },
    domainExpiresAt: { type: Date, default: null },
    tags: [{ type: String, trim: true }],
    alertChannelIds: [{ type: Schema.Types.ObjectId, ref: "AlertChannel" }],
    maintenanceWindows: [MaintenanceWindowSchema],
    isPaused: { type: Boolean, default: false, index: true },
    pausedAt: { type: Date, default: null },
    pausedReason: { type: String, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

MonitorSchema.index({ organizationId: 1, deletedAt: 1, status: 1 });
MonitorSchema.index({ nextCheckAt: 1, isPaused: 1, deletedAt: 1 });
MonitorSchema.index({ organizationId: 1, tags: 1 });

export type MonitorDocument = InferSchemaType<typeof MonitorSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Monitor: Model<MonitorDocument> =
  mongoose.models.Monitor ||
  mongoose.model<MonitorDocument>("Monitor", MonitorSchema);
