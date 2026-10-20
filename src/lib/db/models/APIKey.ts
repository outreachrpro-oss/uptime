import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const APIKeySchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    keyPrefix: { type: String, required: true },
    keyHash: { type: String, required: true, unique: true, select: false },
    scopes: [
      {
        type: String,
        enum: [
          "monitors:read",
          "monitors:write",
          "incidents:read",
          "incidents:write",
          "reports:read",
          "status:read",
        ],
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lastUsedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

APIKeySchema.index({ organizationId: 1, revokedAt: 1 });

export type APIKeyDocument = InferSchemaType<typeof APIKeySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const APIKey: Model<APIKeyDocument> =
  mongoose.models.APIKey ||
  mongoose.model<APIKeyDocument>("APIKey", APIKeySchema);
