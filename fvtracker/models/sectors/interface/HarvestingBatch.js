import { Schema } from "mongoose";
import mongoose from "mongoose";

const harvestingBatchSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  harvestingPlan: {
    type: Schema.Types.ObjectId,
    ref: "HarvestingPlan",
    required: true,
  },
  harvestingBatchItems: [
    {
      type: Schema.Types.ObjectId,
      ref: "HarvestingBatchItem",
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
  await item.save();
  this.harvestingBatchItems.push(item._id);
  await this.save();
  return item;
};

harvestingBatchSchema.methods.addPlantedCropVarieties = async function ({
  plantedCropVarietiesIds,
  cropVarietyId,
}) {
  // Find or create the corresponding HarvestingBatchItem
  const item = await this.findOrCreateItemForCropVariety({
    cropVarietyId: cropVarietyId,
  });
  item.plantedCropVarieties.push(...plantedCropVarietiesIds);
  await item.save();

  return item;
};

harvestingBatchSchema.methods.cropVarietyQuantity = async function ({
  cropVarietyName,
  cropVarietyId,
} = {}) {
  await this.populate({
    path: "harvestingBatchItems",
    select: "cropVariety plantedCropVarieties",
    populate: "cropVariety",
  });

  const item = this.harvestingBatchItems.find((hbi) => {
    if (cropVarietyId) {
      return hbi.cropVariety._id.equals(cropVarietyId);
    } else if (cropVarietyName) {
      return hbi.cropVariety.name === cropVarietyName;
    }
  });

  if (!item)
    throw new Error(
      `Crop variety with name "${cropVarietyName}" not found in this batch.`,
    );

  return item.quantity();
};

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
  plantedCropVarieties: [
    {
      type: Schema.Types.ObjectId,
      ref: "PlantedCropVariety",
      default: [],
    },
  ],
});

harvestingBatchItemSchema.methods.quantity = async function () {
  await this.populate("cropVariety");
  return this.plantedCropVarieties.length * this.cropVariety.quantityPerCells;
};

export const HarvestingBatch =
  mongoose.models.HarvestingBatch ||
  mongoose.model("HarvestingBatch", harvestingBatchSchema);
export const HarvestingBatchItem =
  mongoose.models.HarvestingBatchItem ||
  mongoose.model("HarvestingBatchItem", harvestingBatchItemSchema);
