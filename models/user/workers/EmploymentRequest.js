import mongoose, { Schema } from "mongoose";
import {
  EMPLOYMENT_STATUS_PENDING,
  EMPLOYMENT_STATUSES,
} from "@/lib/constants/users/workers";

const employmentRequestSchema = new Schema(
  {
    worker: { type: Schema.Types.ObjectId, ref: "Worker", required: true },
    status: {
      type: String,
      enum: EMPLOYMENT_STATUSES,
      default: EMPLOYMENT_STATUS_PENDING,
    },
  },
  { timestamps: true },
);

export const EmploymentRequest =
  mongoose.models.EmploymentRequest ||
  mongoose.model("EmploymentRequest", employmentRequestSchema);
