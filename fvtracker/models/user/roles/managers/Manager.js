import mongoose from "mongoose";

const managerSchema = {
  // root manager role for properties shared by all manager types
  managerModelName: {
    type: String,
    enum: [
      "GeneralManager",
      "CultivationManager",
      "ProductionManager",
      "FinancialManager",
      "StorageManager",
    ],
    required: true,
  },
  appUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
    required: true,
  },
  generalManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GeneralManager",
    required: true,
  },
  employees: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Worker", default: [] },
  ],
  employmantCalls: [
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
};

export const Manager =
  mongoose.models.Manager ||
  mongoose.model("Manager", new mongoose.Schema(managerSchema));

const generalManagerSchema = {
  menager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  menagers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Manager", default: [] },
  ],
  employmentRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmploymentRequest",
      default: [],
    },
  ],
  orderRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "OrderRequest", default: [] },
  ],
};

export const GeneralManager =
  mongoose.models.GeneralManager ||
  mongoose.model("GeneralManager", new mongoose.Schema(generalManagerSchema));
