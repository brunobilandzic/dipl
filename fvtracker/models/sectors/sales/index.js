import { ORDER_STATES } from "@/lib/constants/webstore/orders";
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
    {
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
    },
  ],
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
    default: "pending",
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

const shipmentSchema = new Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  shippedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Receipt =
  mongoose.models.Receipt || mongoose.model("Receipt", receiptSchema);
export const Shipment =
  mongoose.models.Shipment || mongoose.model("Shipment", shipmentSchema);
export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
