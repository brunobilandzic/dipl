import { Base } from "@/models/Base";
import mongoose, { Schema } from "mongoose";
import { Machine } from "./Machine";

const productionProcessSchema = new Schema({
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
  },
  machines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Base",
      default: [],
    },
  ],
  stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductStock",
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

productionProcessSchema.pre("deleteMany", async function () {
  const ids = await ProductionProcess.find(this.getFilter()).distinct("_id");
  await Machine.updateMany(
    { productionProcesses: { $in: ids } },
    { $pull: { productionProcesses: { $in: ids } } },
  );
});

productionProcessSchema.statics.findOrCreate = async function ({ name }) {
  console.log({ name });
  let process = await this.findOne({ name });
  if (process) return process;
  return await this.create({ name });
};

export const ProductionProcess =
  mongoose.models.ProductionProcess ||
  Base.discriminator(
    "ProductionProcess",
    new mongoose.Schema(productionProcessSchema),
  );
