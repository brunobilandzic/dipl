import { ROLE_STATUSES } from "@/lib/constants/users";
import {
  CULTIVATION_MANAGER,
  GENERAL_MANAGER,
} from "@/lib/constants/users/managerTypes";
import { RoleRequest } from "@/models/documents/requests/RoleRequest";
import mongoose from "mongoose";

const { Schema } = mongoose;

const rootManagerSchema = new Schema({
  // root manager role for properties shared by all manager types
  managerModelName: {
    type: String,
    enum: [
      "GeneralManager",
      "CultivationManager",
      "ProductionManager",
      "FinancialManager",
      "WarehouseManager",
    ],
    required: true,
  },
  appUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
  roleRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoleRequest",
    default: null,
  },
  generalManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GeneralManager",
    required: true,
  },
  workers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Worker", default: [] },
  ],
  procurments: [
    //people placing orders to buy products
    { type: mongoose.Schema.Types.ObjectId, ref: "Procurment", default: [] },
  ],
});

rootManagerSchema.pre("save", async function () {
  if (this.isNew && this.managerModelName !== GENERAL_MANAGER) {
    const roleRequest = new RoleRequest({
      generalManager: this.generalManager,
      rootManager: this._id,
      status: ROLE_STATUSES.PENDING,
    });
    this.roleRequest = roleRequest._id;
    await roleRequest.save();
  }
});

export const RootManager =
  mongoose.models.RootManager ||
  mongoose.model("RootManager", rootManagerSchema);
