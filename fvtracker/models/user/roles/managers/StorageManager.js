import mongoose from "mongoose";

const { Schema } = mongoose;

const warehouseManagerSchema = new Schema({
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
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
