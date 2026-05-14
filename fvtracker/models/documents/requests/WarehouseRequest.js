import { RequestDocument } from "@/models/Base";
import { Order } from "@/models/sectors/sales";
import { FinancialManager } from "@/models/user/managers/FinancialManager";
import { WarehouseManager } from "@/models/user/managers/WarehouseManager";
import mongoose from "mongoose";

const warehouseRequestSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  financialManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FinancialManager",
    required: true,
  },
  warehouseManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WarehouseManager",
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
});

warehouseRequestSchema.pre("save", async function () {
  if (this.isNew) {
    await FinancialManager.findByIdAndUpdate(this.financialManager, {
      $push: { warehouseRequests: this._id },
    });
    await WarehouseManager.findByIdAndUpdate(this.warehouseManager, {
      $push: { warehouseRequests: this._id },
    });
    const order = await Order.findById(this.order);
    if (!order) throw new Error("Povezana narudžba nije pronađena");
    order.warehouseRequest = this._id;
    await order.save();
  }
});

warehouseRequestSchema.pre("deleteMany", async function () {
  const requestIds = await this.model.find(this.getFilter()).distinct("_id");
  await FinancialManager.updateMany(
    { warehouseRequests: { $in: requestIds } },
    { $pull: { warehouseRequests: { $in: requestIds } } },
  );
  await WarehouseManager.updateMany(
    { warehouseRequests: { $in: requestIds } },
    { $pull: { warehouseRequests: { $in: requestIds } } },
  );
});

export const WarehouseRequest =
  mongoose.models.WarehouseRequest ||
  RequestDocument.discriminator("WarehouseRequest", warehouseRequestSchema);
