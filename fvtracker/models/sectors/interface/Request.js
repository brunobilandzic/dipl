import { FinancialManager } from "@/models/user/managers/FinancialManager";
import { WarehouseManager } from "@/models/user/managers/WarehouseManager";
import mongoose from "mongoose";

const warehouseRequestSchema = new mongoose.Schema({
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

export const WarehouseRequest = Request.discriminator(
  "WarehouseRequest",
  warehouseRequestSchema,
);
