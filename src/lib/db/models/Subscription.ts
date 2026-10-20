import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      unique: true,
      index: true,
    },
    planId: {
      type: String,
      enum: ["starter", "pro", "business"],
      required: true,
    },
    stripeCustomerId: { type: String, default: null, index: true },
    stripeSubscriptionId: { type: String, default: null, unique: true, sparse: true },
    stripePriceId: { type: String, default: null },
    status: {
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
      index: true,
    },
    interval: {
      type: String,
      enum: ["monthly", "yearly", null],
      default: null,
    },
    currentPeriodStart: { type: Date, default: null },
    currentPeriodEnd: { type: Date, default: null },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    canceledAt: { type: Date, default: null },
    trialEndsAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const PaymentSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    stripePaymentIntentId: { type: String, default: null, index: true },
    stripeInvoiceId: { type: String, default: null, unique: true, sparse: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "gbp" },
    status: {
      type: String,
      enum: ["succeeded", "failed", "pending", "refunded"],
      required: true,
    },
    description: { type: String, default: null },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const StripeWebhookEventSchema = new Schema(
  {
    stripeEventId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    processedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export type SubscriptionDocument = InferSchemaType<typeof SubscriptionSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type PaymentDocument = InferSchemaType<typeof PaymentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Subscription: Model<SubscriptionDocument> =
  mongoose.models.Subscription ||
  mongoose.model<SubscriptionDocument>("Subscription", SubscriptionSchema);

export const Payment: Model<PaymentDocument> =
  mongoose.models.Payment ||
  mongoose.model<PaymentDocument>("Payment", PaymentSchema);

export const StripeWebhookEvent =
  mongoose.models.StripeWebhookEvent ||
  mongoose.model("StripeWebhookEvent", StripeWebhookEventSchema);
