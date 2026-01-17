import mongoose from "mongoose";

const roleRequestSchema = {
  appUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
  requestedRole: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  requestedAt: { type: Date, default: () => new Date() },
  reviewedAt: { type: Date },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AppUser" },
};

export const RoleRequest =
  mongoose.models.RoleRequest ||
  mongoose.model("RoleRequest", new mongoose.Schema(roleRequestSchema));
