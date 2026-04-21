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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // add other warerhouuse stock related fields later
});

warehouseStockSchema.pre("save", function () {
  if (this.isModified("quantity") || this.isNew) {
    this.updatedAt = new Date();
  }
});

warehouseStockSchema.pre("deleteMany", async function () {
  const ids = await WarehouseStock.find(this.getFilter()).distinct("_id");
  await Warehouse.updateMany(
    { stocks: { $in: ids } },
    { $pull: { stocks: { $in: ids } } },
  );
});

export const Warehouse =
  mongoose.models.Warehouse ||
  Base.discriminator("Warehouse", new mongoose.Schema(warehouseSchema));

export const WarehouseStock =
  mongoose.models.WarehouseStock ||
  mongoose.model("WarehouseStock", warehouseStockSchema);
