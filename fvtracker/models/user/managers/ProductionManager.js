import mongoose from "mongoose";

const { Schema } = mongoose;

const productionManagerSchema = new Schema({
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
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
});

export const ProductionManager =
  mongoose.models.ProductionManager ||
  mongoose.model("ProductionManager", productionManagerSchema);
