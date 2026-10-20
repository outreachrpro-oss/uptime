import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ReportSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["daily", "weekly", "monthly", "custom", "incident", "ssl"],
      required: true,
    },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true },
    monitorIds: [{ type: Schema.Types.ObjectId, ref: "Monitor" }],
    format: { type: String, enum: ["csv", "pdf", "json"], default: "json" },
    status: {
      type: String,
      enum: ["pending", "ready", "failed"],
      default: "pending",
    },
    data: { type: Schema.Types.Mixed, default: null },
    fileUrl: { type: String, default: null },
    scheduled: { type: Boolean, default: false },
    emailTo: [{ type: String }],
    error: { type: String, default: null },
  },
  { timestamps: true }
);

ReportSchema.index({ organizationId: 1, createdAt: -1 });
ReportSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export type ReportDocument = InferSchemaType<typeof ReportSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Report: Model<ReportDocument> =
  mongoose.models.Report ||
  mongoose.model<ReportDocument>("Report", ReportSchema);
