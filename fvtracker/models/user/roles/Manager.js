import mongoose from "mongoose";

const managerSchema = {
  sector: {
    type: String,
    required: true,
    enum: ["general", "cultivation", "production", "finance", "storage"],
    default: "general",
  },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Worker" }],
  employmentRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "EmploymentRequest" },
  ],
  orderRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "OrderRequest" },
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
  menagers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Manager" }],
  employmentRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "EmploymentRequest" },
  ],
  orderRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "OrderRequest" },
  ],
};

export const GeneralManager =
  mongoose.models.GeneralManager ||
  mongoose.model("GeneralManager", new mongoose.Schema(generalManagerSchema));
