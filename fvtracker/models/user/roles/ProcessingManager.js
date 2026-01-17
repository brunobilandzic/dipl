import mongoose from "mongoose";

const processingManagerSchema = {
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  processingBatches: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ProcessingBatch" },
  ],
  qualityControlReports: [
    { type: mongoose.Schema.Types.ObjectId, ref: "QualityControlReport" },
  ],
  processing: [{ type: mongoose.Schema.Types.ObjectId, ref: "Processing" }],
};
