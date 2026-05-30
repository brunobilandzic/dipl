import { Schema } from "mongoose";
import mongoose from "mongoose";

import { Worker } from ".";

const productionWorkerSchema = new Schema({
  productionProcesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionProcess",
    },
  ],
  warehouseAcceptanceProcesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseAcceptanceProcess",
    },
  ],
});

export const ProductionWorker =
  mongoose.models.ProductionWorker ||
  Worker.discriminator("ProductionWorker", productionWorkerSchema);
