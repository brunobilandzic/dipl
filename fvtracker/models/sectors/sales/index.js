import { ORDER_STATES, PENDING } from "@/lib/constants/webstore/orders";
import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema({
  number: {
    type: String,
    required: true,
    unique: true,
  },
  comment: {
    type: String,
    default: "",
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  items: [
    { type: mongoose.Schema.Types.ObjectId, ref: "OrderItem", required: true },
  ],
  warehouseRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WarehouseRequest",
    default: null,
  },
  receipts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receipt",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const orderItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  shipmentSources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShipmentSource",
      default: [],
    },
  ],
});

const receiptSchema = new Schema({
  shipmentItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShipmentItem",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Receipt =
  mongoose.models.Receipt || mongoose.model("Receipt", receiptSchema);
export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
export const OrderItem =
  mongoose.models.OrderItem || mongoose.model("OrderItem", orderItemSchema);
