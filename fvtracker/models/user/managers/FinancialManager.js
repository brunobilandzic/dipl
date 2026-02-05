import mongoose from "mongoose";

const { Schema } = mongoose;

const financialManagerSchema = new Schema({
  rootManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RootManager",
    required: true,
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] }],
  invoices: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", default: [] },
  ],
  payments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Payment", default: [] },
  ],
  customers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: [] },
  ],
  suppliers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", default: [] },
  ],
});

export const FinancialManager =
  mongoose.models.FinancialManager ||
  mongoose.model("FinancialManager", financialManagerSchema);
