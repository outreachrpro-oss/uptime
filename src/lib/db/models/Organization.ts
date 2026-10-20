import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const OrganizationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planId: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
      index: true,
    },
    stripeCustomerId: { type: String, default: null, index: true },
    stripeSubscriptionId: { type: String, default: null },
    subscriptionStatus: {
      type: String,
      enum: [
        "none",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
        "incomplete",
      ],
      default: "none",
    },
    billingInterval: {
      type: String,
      enum: ["monthly", "yearly", null],
      default: null,
    },
    currentPeriodEnd: { type: Date, default: null },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    settings: {
      timezone: { type: String, default: "Europe/London" },
      defaultIntervalSeconds: { type: Number, default: 300 },
    },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

OrganizationSchema.index({ ownerId: 1, createdAt: -1 });

export type OrganizationDocument = InferSchemaType<typeof OrganizationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Organization: Model<OrganizationDocument> =
  mongoose.models.Organization ||
  mongoose.model<OrganizationDocument>("Organization", OrganizationSchema);
