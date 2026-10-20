import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/** Pre-aggregated hourly/daily stats for fast dashboard charts */
const MonitorAggregateSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    monitorId: {
      type: Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
      index: true,
    },
    period: {
      type: String,
      enum: ["hour", "day"],
      required: true,
    },
    periodStart: { type: Date, required: true },
    totalChecks: { type: Number, default: 0 },
    successfulChecks: { type: Number, default: 0 },
    failedChecks: { type: Number, default: 0 },
    avgResponseMs: { type: Number, default: null },
    minResponseMs: { type: Number, default: null },
    maxResponseMs: { type: Number, default: null },
    uptimePercent: { type: Number, default: null },
  },
  { timestamps: true }
);

MonitorAggregateSchema.index(
  { monitorId: 1, period: 1, periodStart: 1 },
  { unique: true }
);
MonitorAggregateSchema.index({ organizationId: 1, periodStart: -1 });

export type MonitorAggregateDocument = InferSchemaType<
  typeof MonitorAggregateSchema
> & { _id: mongoose.Types.ObjectId };

export const MonitorAggregate: Model<MonitorAggregateDocument> =
  mongoose.models.MonitorAggregate ||
  mongoose.model<MonitorAggregateDocument>(
    "MonitorAggregate",
    MonitorAggregateSchema
  );
