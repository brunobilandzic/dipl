import { Worker } from ".";
import mongoose from "mongoose";

const warehouseWorkerSchema = new mongoose.Schema({
  shipmentItems: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ShipmentItem" },
  ],
});

export const WarehouseWorker =
  mongoose.models.WarehouseWorker ||
  Worker.discriminator("WarehouseWorker", warehouseWorkerSchema);
