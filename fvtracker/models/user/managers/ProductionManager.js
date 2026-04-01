import mongoose from "mongoose";

const { Schema } = mongoose;

const productionManagerSchema = new Schema({
  rootManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RootManager",
    required: true,
  },
  processingBatches: [
    // inputs to production process
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProcessingBatch",
      default: [],
    },
  ],
  productionProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionProduct",
      default: [],
    },
  ],
  qualityControlReports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QualityControlReport",
      default: [],
    },
  ],
  productions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Production", default: [] },
  ],
  harvestingPlans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HarvestingPlan",
      default: [],
    },
  ],
});

export const ProductionManager =
  mongoose.models.ProductionManager ||
  mongoose.model("ProductionManager", productionManagerSchema);
