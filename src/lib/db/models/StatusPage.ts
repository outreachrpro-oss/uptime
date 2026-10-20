import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const StatusPageComponentSchema = new Schema(
  {
    monitorId: {
      type: Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
    },
    displayName: { type: String, required: true },
    description: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    group: { type: String, default: "Services" },
  },
  { _id: true }
);

const StatusPageSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, default: "", maxlength: 500 },
    isPublic: { type: Boolean, default: true },
    passwordHash: { type: String, default: null, select: false },
    branding: {
      primaryColor: { type: String, default: "#4F46E5" },
      logoUrl: { type: String, default: null },
      customDomain: { type: String, default: null },
    },
    components: [StatusPageComponentSchema],
    showUptimeHistory: { type: Boolean, default: true },
    showIncidents: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

StatusPageSchema.index({ organizationId: 1, deletedAt: 1 });

export type StatusPageDocument = InferSchemaType<typeof StatusPageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const StatusPage: Model<StatusPageDocument> =
  mongoose.models.StatusPage ||
  mongoose.model<StatusPageDocument>("StatusPage", StatusPageSchema);
