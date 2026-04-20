import { Base } from "@/models/Base";
import mongoose, { Schema } from "mongoose";
import { Machine } from "./Machine";

const productionProcessSchema = new Schema({
  productionStock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductStock",
  },
  quantity: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productionProcessSchema.statics.findOrCreate = async function ({ name }) {
  let process = await this.findOne({ name });
  if (process) return process;
  return await this.create({ name });
};

export const ProductionProcess =
  mongoose.models.ProductionProcess ||
  mongoose.model("ProductionProcess", productionProcessSchema);
