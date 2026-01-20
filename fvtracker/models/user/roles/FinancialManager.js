import mongoose from "mongoose";

const financialManagerSchema = {
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
  suppliers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }],
};

export const FinancialManager =
  mongoose.models.FinancialManager ||
  mongoose.model(
    "FinancialManager",
    new mongoose.Schema(financialManagerSchema),
  );
