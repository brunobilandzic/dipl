import { Schema } from "mongoose";

const harvestingBatchSchema = new Schema({
  harvestingPlan: {
    type: Schema.Types.ObjectId,
    ref: "HarvestingPlan",
    required: true,
  },
  harvestBatchItems: [
    {
      type: Schema.Types.ObjectId,
      ref: "HarvestBatchItem",
      default: [],
    },
  ],
  productions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Production",
      default: [],
    },
  ],
});

const harvestingBatchItemSchema = new Schema({
  harvestingBatch: {
    type: Schema.Types.ObjectId,
    ref: "HarvestingBatch",
    required: true,
  },
  cropVariety: {
    type: Schema.Types.ObjectId,
    ref: "CropVariety",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  plantedCropVarieties: [
    {
      type: Schema.Types.ObjectId,
      ref: "PlantedCropVariety",
      default: [],
    },
  ],
});

harvestingBatchSchema.methods.addPlantedCropVariety = async function ({
  plantedCropVariety,
  quantity,
}) {
  // Find or create the corresponding HarvestingBatchItem
};

export const HarvestingBatch = mongoose.model(
  "HarvestingBatch",
  harvestingBatchSchema,
);
export const HarvestingBatchItem = mongoose.model(
  "HarvestingBatchItem",
  harvestingBatchItemSchema,
);
