import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const IncidentEventSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "created",
        "status_change",
        "acknowledged",
        "note",
        "alert_sent",
        "resolved",
      ],
      required: true,
    },
    message: { type: String, required: true },
    status: { type: String, default: null },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const IncidentSchema = new Schema(
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
    incidentNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ["investigating", "identified", "monitoring", "resolved"],
      default: "investigating",
      index: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    failureReason: { type: String, required: true },
    errorCode: { type: String, default: null },
    startedAt: { type: Date, required: true, index: true },
    resolvedAt: { type: Date, default: null },
    durationMs: { type: Number, default: null },
    acknowledgedAt: { type: Date, default: null },
    acknowledgedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    notes: { type: String, default: "" },
    events: [IncidentEventSchema],
    alertSentAt: { type: Date, default: null },
    recoveryAlertSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

IncidentSchema.index({ organizationId: 1, isActive: 1, startedAt: -1 });
IncidentSchema.index(
  { monitorId: 1, isActive: 1 },
  { partialFilterExpression: { isActive: true } }
);
IncidentSchema.index({ organizationId: 1, incidentNumber: 1 }, { unique: true });

export type IncidentDocument = InferSchemaType<typeof IncidentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Incident: Model<IncidentDocument> =
  mongoose.models.Incident ||
  mongoose.model<IncidentDocument>("Incident", IncidentSchema);
