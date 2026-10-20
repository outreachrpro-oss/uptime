import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const AlertChannelSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    type: {
      type: String,
      enum: ["email", "slack", "discord", "webhook", "sms"],
      required: true,
    },
    /** Encrypted config blob — never store plaintext secrets */
    configEncrypted: { type: String, required: true, select: false },
    isEnabled: { type: Boolean, default: true },
    lastTestedAt: { type: Date, default: null },
    lastTestStatus: {
      type: String,
      enum: ["success", "failure", null],
      default: null,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

AlertChannelSchema.index({ organizationId: 1, type: 1 });

export type AlertChannelDocument = InferSchemaType<typeof AlertChannelSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AlertChannel: Model<AlertChannelDocument> =
  mongoose.models.AlertChannel ||
  mongoose.model<AlertChannelDocument>("AlertChannel", AlertChannelSchema);
