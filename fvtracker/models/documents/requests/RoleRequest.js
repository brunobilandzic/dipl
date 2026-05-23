const { Schema } = require("mongoose");
import { ROLE_STATUSES } from "@/lib/constants/users";
import mongoose from "mongoose";

const roleRequestSchema = new Schema({
  generalManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GeneralManager",
    required: true,
  },
  rootManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RootManager",
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(ROLE_STATUSES),
    default: ROLE_STATUSES.PENDING,
  },
});

const generalManagerRequestSchema = new Schema({
  appUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(ROLE_STATUSES),
    default: ROLE_STATUSES.PENDING,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
});

generalManagerRequestSchema.pre("save", async function () {
  const admin = await mongoose.models.Admin.findById(this.admin);
  if (!admin) {
    throw new Error("Admin not found for General Manager Request.");
  }
  admin.generalManagerRequests.push(this._id);
  await admin.save();
});

roleRequestSchema.pre("save", async function () {
  const generalManager = await mongoose.models.GeneralManager.findById(
    this.generalManager,
  );
  if (!generalManager) {
    throw new Error("General Manager not found for Role Request.");
  }
  generalManager.roleRequests.push(this._id);
  await generalManager.save();
});

export const RoleRequest =
  mongoose.models.RoleRequest ||
  mongoose.model("RoleRequest", roleRequestSchema);
export const GeneralManagerRequest =
  mongoose.models.GeneralManagerRequest ||
  mongoose.model("GeneralManagerRequest", generalManagerRequestSchema);
