import mongoose from "mongoose";

const WarehouseRequestSchema = new mongoose.Schema({
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

export const WarehouseRequest = Request.discriminator(
  "WarehouseRequest",
  WarehouseRequestSchema,
);
