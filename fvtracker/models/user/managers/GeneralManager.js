import mongoose, { Schema } from "mongoose";

const generalManagerSchema = new Schema({
  rootManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RootManager",
    default: null,
  },
  managers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "RootManager", default: [] },
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
});

export const GeneralManager =
  mongoose.models.GeneralManager ||
  mongoose.model("GeneralManager", generalManagerSchema);
