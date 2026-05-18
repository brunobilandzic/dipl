import { ORDER_STATES, PENDING } from "@/lib/constants/webstore/orders";
import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema({
  number: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  items: [
    { type: mongoose.Schema.Types.ObjectId, ref: "OrderItem", required: true },
  ],
  shippedItems: [
    { type: mongoose.Schema.Types.ObjectId, ref: "OrderItem", required: true },
  ],
  warehouseRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WarehouseRequest",
    default: null,
  },
  receipt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Receipt",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  state: {
    type: String,
    enum: ORDER_STATES,
    default: PENDING,
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
});

const receiptSchema = new Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  number: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Receipt =
  mongoose.models.Receipt || mongoose.model("Receipt", receiptSchema);
export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
export const OrderItem =
  mongoose.models.OrderItem || mongoose.model("OrderItem", orderItemSchema);
