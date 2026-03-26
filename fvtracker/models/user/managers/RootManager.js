import { GENERAL_MANAGER } from "@/lib/constants/users/managerTypes";
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
  },
  generalManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GeneralManager",
    required: true,
  },
  employees: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Worker", default: [] },
  ],
  employmentCalls: [
    // job postings created by the manager
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmploymentCall",
      default: [],
    },
  ],
  employmentRequests: [
    // people applying for jobs
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmploymentRequest",
      default: [],
    },
  ],
  orderRequests: [
    //people placing orders to buy products
    { type: mongoose.Schema.Types.ObjectId, ref: "OrderRequest", default: [] },
  ],
});

rootManagerSchema.pre("save", async function () {
  console.log("Creating Role Request for new Root Manager");
  if (this.isNew && this.managerModelName !== GENERAL_MANAGER) {
    console.log("Creating role request for manager model:", this.managerModelName);
    const roleRequest = new RoleRequest({
      generalManager: this.generalManager,
      rootManager: this._id,
    });
    this.roleRequest = roleRequest._id;
    await roleRequest.save();
  }
});

export const RootManager =
  mongoose.models.RootManager ||
  mongoose.model("RootManager", rootManagerSchema);
