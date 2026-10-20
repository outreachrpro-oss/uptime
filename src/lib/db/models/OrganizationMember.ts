import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const OrganizationMemberSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["org_owner", "org_admin", "team_member", "viewer"],
      required: true,
    },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    invitedAt: { type: Date, default: null },
    acceptedAt: { type: Date, default: null },
    inviteToken: { type: String, default: null, select: false },
    inviteExpiresAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["pending", "active", "removed"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

OrganizationMemberSchema.index(
  { organizationId: 1, userId: 1 },
  { unique: true }
);
OrganizationMemberSchema.index({ inviteToken: 1 }, { sparse: true });

export type OrganizationMemberDocument = InferSchemaType<
  typeof OrganizationMemberSchema
> & { _id: mongoose.Types.ObjectId };

export const OrganizationMember: Model<OrganizationMemberDocument> =
  mongoose.models.OrganizationMember ||
  mongoose.model<OrganizationMemberDocument>(
    "OrganizationMember",
    OrganizationMemberSchema
  );
