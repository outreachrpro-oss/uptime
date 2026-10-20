import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SupportTicketSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },
    ipHash: { type: String, default: null },
    userAgent: { type: String, default: null },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

SupportTicketSchema.index({ createdAt: -1 });
SupportTicketSchema.index({ email: 1, createdAt: -1 });

export type SupportTicketDocument = InferSchemaType<typeof SupportTicketSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SupportTicket: Model<SupportTicketDocument> =
  mongoose.models.SupportTicket ||
  mongoose.model<SupportTicketDocument>("SupportTicket", SupportTicketSchema);
