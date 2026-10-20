import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SchedulerStateSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    workerId: { type: String, default: null },
    lastHeartbeatAt: { type: Date, default: null },
    lastTickAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["idle", "running", "unhealthy", "stopped"],
      default: "idle",
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export type SchedulerStateDocument = InferSchemaType<
  typeof SchedulerStateSchema
> & { _id: mongoose.Types.ObjectId };

export const SchedulerState: Model<SchedulerStateDocument> =
  mongoose.models.SchedulerState ||
  mongoose.model<SchedulerStateDocument>("SchedulerState", SchedulerStateSchema);
