import { Schema } from "mongoose";
import mongoose from "mongoose";

const shipmentSchema = {
  warehouseRequest: {
    type: Schema.Types.ObjectId,
    ref: "WarehouseRequest",
  },
  warehouseItems: [
    {
      warehouse: {
        type: Schema.Types.ObjectId,
        ref: "Warehouse",
      },
      quantity: Number,
    },
  ],
  warehouseManager: {
    type: Schema.Types.ObjectId,
    ref: "WarehouseManager",
  },
  financialManager: {
    type: Schema.Types.ObjectId,
    ref: "FinancialManager",
  },
};

export const Shipment = mongoose.model("Shipment", shipmentSchema);
