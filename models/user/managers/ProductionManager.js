import mongoose from "mongoose";

const { Schema } = mongoose;

const productionManagerSchema = new Schema({
  rootManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RootManager",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
  productionProcesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionProcess",
      default: [],
    },
  ],
});

export const ProductionManager =
  mongoose.models.ProductionManager ||
  mongoose.model("ProductionManager", productionManagerSchema);
