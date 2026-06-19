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

orderSchema.pre("deleteMany", async function () {
  const orders = await this.model.find(this.getFilter());
  const orderIds = orders.map((o) => o._id);
  await mongoose.model("OrderItem").deleteMany({ order: { $in: orderIds } });
  console.log("Deleted order items for orders:", orderIds);
  await mongoose
    .model("WarehouseRequest")
    .deleteMany({ order: { $in: orderIds } });
  console.log("Deleted warehouse requests for orders:", orderIds);
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
  financialWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FinancialWorker",
    required: true,
  },
});

receiptSchema.pre("deleteMany", async function () {
  const receipts = await this.model.find(this.getFilter());
  const receiptIds = receipts.map((r) => r._id);
  await mongoose
    .model("ShipmentItem")
    .updateMany({ receipt: { $in: receiptIds } }, { $set: { receipt: null } });
  await mongoose
    .model("FinancialWorker")
    .updateMany(
      { receipts: { $in: receiptIds } },
      { $pull: { receipts: { $in: receiptIds } } },
    );
});
export const Receipt =
  mongoose.models.Receipt || mongoose.model("Receipt", receiptSchema);
export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
export const OrderItem =
  mongoose.models.OrderItem || mongoose.model("OrderItem", orderItemSchema);
