import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const VerificationTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type VerificationTokenDocument = InferSchemaType<
  typeof VerificationTokenSchema
> & { _id: mongoose.Types.ObjectId };

export type PasswordResetTokenDocument = InferSchemaType<
  typeof PasswordResetTokenSchema
> & { _id: mongoose.Types.ObjectId };

export const VerificationToken: Model<VerificationTokenDocument> =
  mongoose.models.VerificationToken ||
  mongoose.model<VerificationTokenDocument>(
    "VerificationToken",
    VerificationTokenSchema
  );

export const PasswordResetToken: Model<PasswordResetTokenDocument> =
  mongoose.models.PasswordResetToken ||
  mongoose.model<PasswordResetTokenDocument>(
    "PasswordResetToken",
    PasswordResetTokenSchema
  );
