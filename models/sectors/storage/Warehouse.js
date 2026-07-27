import { Base } from "@/models/Base";
import { Schema } from "mongoose";
import mongoose from "mongoose";
import { Product } from "../production/Product";
import { ProductionWorker } from "@/models/user/workers/ProductionWork";

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
  volume: {
    type: Number,
    required: true,
  },
});

const warehouseStockSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
    required: true,
  },
  warehouseAcceptanceProcesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseAcceptanceProcess",
      default: [],
    },
  ],
  shipmentSources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShipmentSource",
      default: [],
    },
  ],
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
  productionStock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductionStock",
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
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductionWorker",
  },
});

warehouseAcceptanceProcessSchema.pre("save", async function () {
  if (this.isNew) {
    const productionWorker = await ProductionWorker.findById(this.worker);
    if (productionWorker) {
      productionWorker.warehouseAcceptanceProcesses.push(this._id);
      await productionWorker.save();
    }
    const productionStock = await mongoose
      .model("ProductionStock")
      .findById(this.productionStock);

    if (productionStock) {
      productionStock.warehouseAcceptanceProcesses.push(this._id);
      await productionStock.save();
    }
  }
});

warehouseSchema.pre("deleteMany", async function () {
  const ids = await Warehouse.find(this.getFilter()).distinct("_id");
  await WarehouseStock.deleteMany({ warehouse: { $in: ids } });
});

warehouseSchema.methods.totalVolumeUsed = async function () {
  const stocks = await mongoose
    .model("WarehouseStock")
    .find({ warehouse: this._id })
    .populate("product");
  return stocks.reduce((total, stock) => {
    const productVolume = stock.product.volume || 0;
    return total + productVolume * stock.quantity;
  }, 0);
};

warehouseStockSchema.pre("save", function () {
  if (this.isModified("quantity") || this.isNew) {
    this.updatedAt = new Date();
  }
});

warehouseStockSchema.pre("deleteMany", async function () {
  const ids = await WarehouseStock.find(this.getFilter()).distinct("_id");
  await Product.updateMany(
    { warehouseStocks: { $in: ids } },
    { $pull: { warehouseStocks: { $in: ids } } },
  );
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
  mongoose.model(
    "WarehouseAcceptanceProcess",
    warehouseAcceptanceProcessSchema,
  );
