import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CookieConsentSchema = new Schema(
  {
    visitorId: { type: String, required: true, index: true },
    necessary: { type: Boolean, default: true },
    analytics: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
    consentedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

CookieConsentSchema.index({ visitorId: 1 }, { unique: true });

export type CookieConsentDocument = InferSchemaType<
  typeof CookieConsentSchema
> & { _id: mongoose.Types.ObjectId };

export const CookieConsent: Model<CookieConsentDocument> =
  mongoose.models.CookieConsent ||
  mongoose.model<CookieConsentDocument>("CookieConsent", CookieConsentSchema);
