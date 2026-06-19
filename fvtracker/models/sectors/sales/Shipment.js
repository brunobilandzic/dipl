import {
  SHIPMENT_STATUSES,
  SHIPMENT_PENDING,
} from "@/lib/constants/warehouse/shipment";
import { WarehouseWorker } from "@/models/user/workers/WarehouseWork";
import { Schema } from "mongoose";
import mongoose from "mongoose";

const shipmentSchema = new Schema({
  warehouseRequest: {
    type: Schema.Types.ObjectId,
    ref: "WarehouseRequest",
    required: true,
  },
  shipmentItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShipmentItem",
      default: [],
    },
  ],
  status: {
    type: String,
    enum: SHIPMENT_STATUSES,
    default: SHIPMENT_PENDING,
  },
};

const shipmentItemSchema = new Schema({
  shipment: {
    type: Schema.Types.ObjectId,
    ref: "Shipment",
  },
  sources: [
    {
      type: Schema.Types.ObjectId,
      ref: "ShipmentSource",
      default: [],
    },
  ],
  receipt: {
    type: Schema.Types.ObjectId,
    ref: "Receipt",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WarehouseWorker",
    default: null,
  },
});

shipmentItemSchema.pre("save", async function () {
  if (this.isNew) {
    const warehouseWorker = await WarehouseWorker.findById(this.worker);
    warehouseWorker.shipmentItems.push(this._id);
    await warehouseWorker.save();
  }
});

const shipmentSourceSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Base",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  shipmentItem: {
    type: Schema.Types.ObjectId,
    ref: "ShipmentItem",
  },
  warehouseStock: {
    type: Schema.Types.ObjectId,
    ref: "WarehouseStock",
  },
});

export const Shipment =
  mongoose.models.Shipment || mongoose.model("Shipment", shipmentSchema);
export const ShipmentItem =
  mongoose.models.ShipmentItem ||
  mongoose.model("ShipmentItem", shipmentItemSchema);
export const ShipmentSource =
  mongoose.models.ShipmentSource ||
  mongoose.model("ShipmentSource", shipmentSourceSchema);
