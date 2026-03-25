const { Schema } = require("mongoose");
import mongoose from "mongoose";

const roleRequestSchema = new Schema({
  generalManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GeneralManager",
    required: true,
  },
  requestManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RootManager",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

roleRequestSchema.pre("save", async function () {
    const generalManager = await mongoose.models.GeneralManager.findById(this.generalManager);
    if (!generalManager) {
      throw new Error("General Manager not found for Role Request.");
    }
    generalManager.roleRequests.push(this._id);
    await generalManager.save();
})

export const RoleRequest =
  mongoose.models.RoleRequest ||
  mongoose.model("RoleRequest", roleRequestSchema);
