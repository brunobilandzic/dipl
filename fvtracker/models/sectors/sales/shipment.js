import { Schema } from "mongoose";
import mongoose from "mongoose";

const shipmentSchema = {
  warehouseRequest: {
    type: Schema.Types.ObjectId,
    ref: "WarehouseRequest",
    required: true,
  },
  warehouseItems: [
    {
      warehouse: {
        type: Schema.Types.ObjectId,
        ref: "Warehouse",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  warehouseManager: {
    type: Schema.Types.ObjectId,
    ref: "WarehouseManager",
    required: true,
  },
  financialManager: {
    type: Schema.Types.ObjectId,
    ref: "FinancialManager",
    required: true,
  },
};

export const Shipment = mongoose.model("Shipment", shipmentSchema);
