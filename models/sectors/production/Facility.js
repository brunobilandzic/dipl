import { Base } from "@/models/Base";
import { Schema } from "mongoose";
import mongoose from "mongoose";
import { ProductionProcess } from "./Process";
import { Product } from "./Product";

const productionFacilitySchema = new Schema({
  stocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionStock",
      default: [],
    },
  ],
  volume: {
    type: Number,
    required: true,
  },
});

const productionStockSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  productionProcesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionProcess",
      default: [],
    },
  ],
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
  },
  warehouseAcceptanceProcesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseAcceptanceProcess",
      default: [],
    },
  ],
});

productionStockSchema.pre("deleteMany", async function () {
  const ids = await ProductionStock.find(this.getFilter()).distinct("_id");
  await ProductionProcess.deleteMany({ productionStock: { $in: ids } });
  await ProductionFacility.updateMany(
    { stocks: { $in: ids } },
    { $pull: { stocks: { $in: ids } } },
  );
  await Product.updateMany(
    { productionStocks: { $in: ids } },
    { $pull: { productionStocks: { $in: ids } } },
  );
});

productionFacilitySchema.pre("deleteMany", async function () {
  const facilities = await this.model.find(this.getFilter()).distinct("_id");
  await mongoose.model("ProductionStock").deleteMany({
    productionFacility: { $in: facilities },
  });
});

productionFacilitySchema.methods.totalVolumeUsed = async function () {
  const stocks = await mongoose
    .model("ProductionStock")
    .find({ facility: this._id })
    .populate("product");
  return stocks.reduce((total, stock) => {
    const productVolume = stock.product.volume || 0;
    return total + productVolume * stock.quantity;
  }, 0);
};

export const ProductionFacility =
  mongoose.models.ProductionFacility ||
  Base.discriminator("ProductionFacility", productionFacilitySchema);

export const ProductionStock =
  mongoose.models.ProductionStock ||
  mongoose.model("ProductionStock", productionStockSchema);
