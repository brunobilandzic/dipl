import { Schema } from "mongoose";
import mongoose from "mongoose";

const shipmentSchema = {
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
};

const shipmentItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Base",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  shipment: {
    type: Schema.Types.ObjectId,
    ref: "Shipment",
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
