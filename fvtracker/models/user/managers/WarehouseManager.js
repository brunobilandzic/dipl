import mongoose from "mongoose";

const { Schema } = mongoose;

const warehouseManagerSchema = new Schema({
  rootManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RootManager",
    required: true,
  },
  warehouses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      default: null,
    },
  ],
  warehouseRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseRequest",
      default: [],
    },
  ],
});

export const WarehouseManager =
  mongoose.models.WarehouseManager ||
  mongoose.model("WarehouseManager", warehouseManagerSchema);
