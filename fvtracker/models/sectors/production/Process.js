import { Base } from "@/models/Base";
import mongoose, { Schema } from "mongoose";
import { Machine } from "./Machine";
import { ProductionWorker } from "@/models/user/workers/ProductionWork";

const productionProcessSchema = new Schema({
  comment: {
    type: String,
    default: "Izrada proizvoda",
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
  processedAt: {
    type: Date,
    default: Date.now,
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductionWorker",
  },
});

productionProcessSchema.statics.findOrCreate = async function ({ name }) {
  let process = await this.findOne({ name });
  if (process) return process;
  return await this.create({ name });
};

productionProcessSchema.pre("save", async function () {
  if (this.isNew) {
    const worker = await ProductionWorker.findById(this.worker);
    if (!worker) {
      throw new Error(`Production worker with id ${this.worker} not found.`);
    }
    worker.productionProcesses.push(this._id);
    await worker.save();

    const productionStock = await mongoose
      .model("ProductionStock")
      .findById(this.productionStock);
    if (!productionStock) {
      throw new Error(
        `Production stock with id ${this.productionStock} not found.`,
      );
    }
    productionStock.productionProcesses.push(this._id);
    await productionStock.save();
  }
});

productionProcessSchema.pre("deleteMany", async function () {
  const docs = await ProductionProcess.find(this.getFilter()).distinct("_id");
  await ProductionWorker.updateMany(
    { productionProcesses: { $in: docs } },
    { $pull: { productionProcesses: { $in: docs } } },
  );
});

export const ProductionProcess =
  mongoose.models.ProductionProcess ||
  mongoose.model("ProductionProcess", productionProcessSchema);
