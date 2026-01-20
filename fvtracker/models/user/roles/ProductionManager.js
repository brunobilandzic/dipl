import mongoose from "mongoose";

const productionManagerSchema = {
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  generalManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GeneralManager",
    required: true,
  },
  processingBatches: [
    // inputs to production process
    { type: mongoose.Schema.Types.ObjectId, ref: "ProcessingBatch" },
  ],
  productionProducts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ProductionProduct" },
  ],
  qualityControlReports: [
    { type: mongoose.Schema.Types.ObjectId, ref: "QualityControlReport" },
  ],
  productions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Production" }],
};

export const ProductionManager =
  mongoose.models.ProductionManager ||
  mongoose.model(
    "ProductionManager",
    new mongoose.Schema(productionManagerSchema),
  );
