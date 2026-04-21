import { Base } from "@/models/Base";
import { Schema } from "mongoose";
import mongoose from "mongoose";
import { ProductionProcess } from "./Process";

const productionFacilitySchema = new Schema({
  stocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionStock",
      default: [],
    },
  ],
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
  processes: [
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
});

productionStockSchema.pre("deleteMany", async function () {
  const ids = await ProductionStock.find(this.getFilter()).distinct("_id");
  console.log({ stocksIds: ids });
  await ProductionProcess.deleteMany({ productionStock: { $in: ids } });
  await ProductionFacility.updateMany(
    { stocks: { $in: ids } },
    { $pull: { stocks: { $in: ids } } },
  );
});

productionFacilitySchema.pre("deleteMany", async function () {
  const facilities = await this.model.find(this.getFilter()).distinct("_id");
  await mongoose.model("ProductionStock").deleteMany({
    productionFacility: { $in: facilities },
  });
});

export const ProductionFacility =
  mongoose.models.ProductionFacility ||
  Base.discriminator("ProductionFacility", productionFacilitySchema);

export const ProductionStock =
  mongoose.models.ProductionStock ||
  mongoose.model("ProductionStock", productionStockSchema);
