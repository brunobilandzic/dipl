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

const warehouseAcceptanceProcessSchema = new Schema({
  comment: {
    type: String,
    default: "Prihvat proizvoda u skladište",
  },
  warehouseStock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WarehouseStock",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  acceptedAt: {
    type: Date,
    default: Date.now,
  },
});

warehouseSchema.pre("deleteMany", async function () {
  const ids = await Warehouse.find(this.getFilter()).distinct("_id");
  await WarehouseStock.deleteMany({ warehouse: { $in: ids } });
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

export const WarehouseAcceptanceProcess =
  mongoose.models.WarehouseAcceptanceProcess ||
  mongoose.model("WarehouseAcceptanceProcess", warehouseAcceptanceProcessSchema);
