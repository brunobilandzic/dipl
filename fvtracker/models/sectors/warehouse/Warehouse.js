import { Base } from "@/models/Base";
import { Schema } from "mongoose";
import mongoose from "mongoose";

const warehouseSchema = new Schema({
  warehouseManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WarehouseManager",
  },
  stocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseStock",
      default: [],
    },
  ],
});

const warehouseStockSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
  },
  // add other warerhouuse stock related fields later
});

export const Warehouse =
  mongoose.models.Warehouse ||
  Base.discriminator("Warehouse", new mongoose.Schema(warehouseSchema));

export const WarehouseStock =
  mongoose.models.WarehouseStock ||
  mongoose.model("WarehouseStock", warehouseStockSchema);
