import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const NotificationDeliverySchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    alertChannelId: {
      type: Schema.Types.ObjectId,
      ref: "AlertChannel",
      required: true,
    },
    monitorId: { type: Schema.Types.ObjectId, ref: "Monitor", default: null },
    incidentId: { type: Schema.Types.ObjectId, ref: "Incident", default: null },
    eventType: {
      type: String,
      enum: [
        "monitor_down",
        "monitor_recovered",
        "ssl_expiring",
        "domain_expiring",
        "test",
        "subscription",
        "report",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed", "skipped"],
      default: "pending",
      index: true,
    },
    attempts: { type: Number, default: 0 },
    lastError: { type: String, default: null },
    sentAt: { type: Date, default: null },
    payloadSummary: { type: String, default: null },
    dedupeKey: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

NotificationDeliverySchema.index(
  { dedupeKey: 1 },
  { unique: true }
);
NotificationDeliverySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export type NotificationDeliveryDocument = InferSchemaType<
  typeof NotificationDeliverySchema
> & { _id: mongoose.Types.ObjectId };

export const NotificationDelivery: Model<NotificationDeliveryDocument> =
  mongoose.models.NotificationDelivery ||
  mongoose.model<NotificationDeliveryDocument>(
    "NotificationDelivery",
    NotificationDeliverySchema
  );
