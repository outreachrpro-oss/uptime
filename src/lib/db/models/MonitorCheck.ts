import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const MonitorCheckSchema = new Schema(
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
    status: {
      type: String,
      enum: ["up", "down", "error", "timeout", "unknown"],
      required: true,
      index: true,
    },
    responseTimeMs: { type: Number, default: null },
    statusCode: { type: Number, default: null },
    errorCode: { type: String, default: null },
    errorMessage: { type: String, default: null },
    timing: {
      dnsMs: { type: Number, default: null },
      connectMs: { type: Number, default: null },
      tlsMs: { type: Number, default: null },
      ttfbMs: { type: Number, default: null },
      totalMs: { type: Number, default: null },
    },
    checkedAt: { type: Date, required: true, index: true },
    region: { type: String, default: "default" },
  },
  { timestamps: false }
);

// Compound index for history queries; TTL handled by retention cleanup job
MonitorCheckSchema.index({ monitorId: 1, checkedAt: -1 });
MonitorCheckSchema.index({ organizationId: 1, checkedAt: -1 });
MonitorCheckSchema.index(
  { checkedAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 400 } // max 400 days; plan retention enforced in app
);

export type MonitorCheckDocument = InferSchemaType<typeof MonitorCheckSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const MonitorCheck: Model<MonitorCheckDocument> =
  mongoose.models.MonitorCheck ||
  mongoose.model<MonitorCheckDocument>("MonitorCheck", MonitorCheckSchema);
