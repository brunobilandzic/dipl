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
  console.log(this._doc);
  if (this.isNew) {
    const roleRequest = new RoleRequest({
      generalManager: this.generalManager,
      rootManager: this._id,
    });
    await roleRequest.save();
  }
});

export const RootManager =
  mongoose.models.RootManager ||
  mongoose.model("RootManager", rootManagerSchema);
