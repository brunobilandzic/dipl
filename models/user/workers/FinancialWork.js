import mongoose, { Schema } from "mongoose";
import { Worker } from ".";

const financialWorkerSchema = new Schema({
  warehouseRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseRequest",
    },
  ],
  receipts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receipt",
    },
  ],
});

export const FinancialWorker =
  mongoose.models.FinancialWorker ||
  Worker.discriminator("FinancialWorker", financialWorkerSchema);
