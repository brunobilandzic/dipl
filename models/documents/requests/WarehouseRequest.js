import { WAREHOUSE_REQUESTED } from "@/lib/constants/webstore/orders";
import { RequestDocument } from "@/models/Base";
import { Order } from "@/models/sectors/sales";
import { Shipment } from "@/models/sectors/sales/Shipment";
import { FinancialManager } from "@/models/user/managers/FinancialManager";
import { WarehouseManager } from "@/models/user/managers/WarehouseManager";
import { FinancialWorker } from "@/models/user/workers/FinancialWork";
import mongoose from "mongoose";

const warehouseRequestSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  warehouseManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WarehouseManager",
    required: true,
  },
  shipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shipment",
    default: null,
  },
  financialManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FinancialManager",
    required: true,
  },
  financialWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FinancialWorker",
    default: null,
  },
});

warehouseRequestSchema.pre("save", async function () {
  if (this.isNew) {
    const shipment = new Shipment({
      warehouseRequest: this._id,
    });
    this.shipment = shipment._id;
    await shipment.save();
    await FinancialManager.findByIdAndUpdate(this.financialManager, {
      $push: { warehouseRequests: this._id },
    });
    await WarehouseManager.findByIdAndUpdate(this.warehouseManager, {
      $push: { warehouseRequests: this._id },
    });
    const order = await Order.findById(this.order);
    if (!order) throw new Error("Povezana narudžba nije pronađena");
    order.warehouseRequest = this._id;
    order.state = WAREHOUSE_REQUESTED;
    const financialWorker = await FinancialWorker.findById(
      this.financialWorker,
    );
    if (!financialWorker)
      throw new Error("Povezani finansijski radnik nije pronađen");
    financialWorker.warehouseRequests.push(this._id);
    await financialWorker.save();
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
  await FinancialWorker.updateMany(
    { warehouseRequests: { $in: requestIds } },
    { $pull: { warehouseRequests: { $in: requestIds } } },
  );
  await Shipment.deleteMany({ warehouseRequest: { $in: requestIds } });
});

export const WarehouseRequest =
  mongoose.models.WarehouseRequest ||
  RequestDocument.discriminator("WarehouseRequest", warehouseRequestSchema);
