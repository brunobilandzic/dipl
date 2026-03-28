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

harvestingBatchSchema.methods.findOrCreateItemForCropVariety = async function ({
  cropVarietyId,
}) {
  let item = await HarvestingBatchItem.findOne({
    harvestingBatch: this._id,
    cropVariety: cropVarietyId,
  });
  if (!item)
    item = new HarvestingBatchItem({
      harvestingBatch: this._id,
      cropVariety: cropVarietyId,
    });
  return item;
};

harvestingBatchSchema.methods.addPlantedCropVarieties = async function ({
  plantedCropVarieties,
  quantity,
}) {
  // Find or create the corresponding HarvestingBatchItem
  const item = await this.findOrCreateItemForCropVariety({
    cropVarietyId: plantedCropVarieties[0], // Assuming the first variety is the main one
  });
  // Update the quantity or perform other operations as needed
  item.quantity = (item.quantity || 0) + quantity;
  await item.save();
};

export const HarvestingBatch = mongoose.model(
  "HarvestingBatch",
  harvestingBatchSchema,
);
export const HarvestingBatchItem = mongoose.model(
  "HarvestingBatchItem",
  harvestingBatchItemSchema,
);
