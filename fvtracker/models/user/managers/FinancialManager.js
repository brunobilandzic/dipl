import mongoose from "mongoose";

const { Schema } = mongoose;

const financialManagerSchema = new Schema({
  rootManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RootManager",
    required: true,
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] }],
});

export const FinancialManager =
  mongoose.models.FinancialManager ||
  mongoose.model("FinancialManager", financialManagerSchema);
