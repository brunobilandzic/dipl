import { Schema } from "mongoose";

const HarvestBatchSchema = new Schema({
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

const HarvestBatchItemSchema = new Schema({
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

export const HarvestBatch = mongoose.model("HarvestBatch", HarvestBatchSchema);
export const HarvestBatchItem = mongoose.model(
  "HarvestBatchItem",
  HarvestBatchItemSchema,
);
