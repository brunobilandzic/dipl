import mongoose from "mongoose";

const { Schema } = mongoose;

const warehouseManagerSchema = new Schema({
  rootManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RootManager",
    required: true,
  },
  storageFacility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StorageFacility",
    default: null,
  },
});

export const WarehouseManager =
  mongoose.models.WarehouseManager ||
  mongoose.model("WarehouseManager", warehouseManagerSchema);
