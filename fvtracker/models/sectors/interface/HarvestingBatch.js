import { Schema } from "mongoose";
import mongoose from "mongoose";
import { CropVariety, PlantedCropVariety } from "../cultivation/Crops";

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
  productionProcesses: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProductionProcess",
      default: [],
    },
  ],
  productsStocks: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProductStock",
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
  batchQuantity: {
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

harvestingBatchSchema.pre("deleteMany", async function () {
  const ids = await HarvestingBatch.find(this.getFilter()).distinct("_id");
  await HarvestingBatchItem.deleteMany({ harvestingBatch: { $in: ids } });
});

harvestingBatchSchema.methods.findOrCreateItemForCropVariety = async function ({
  cropVarietyId,
}) {
  let item = await HarvestingBatchItem.findOne({
    harvestingBatch: this._id,
    cropVariety: cropVarietyId,
  });
  if (!item) {
    item = new HarvestingBatchItem({
      harvestingBatch: this._id,
      cropVariety: cropVarietyId,
    });
    this.harvestingBatchItems.push(item._id);
  }

  await item.save();
  await this.save();
  return item;
};

harvestingBatchSchema.methods.addPlantedCropVarieties = async function ({
  plantedCropVarietiesIds,
  cropVarietyId,
  quantityPerCell,
}) {
  // Find or create the corresponding HarvestingBatchItem
  const item = await this.findOrCreateItemForCropVariety({
    cropVarietyId: cropVarietyId,
  });
  item.plantedCropVarieties.push(...plantedCropVarietiesIds);
  const addedQuantity = plantedCropVarietiesIds.length * quantityPerCell;
  item.batchQuantity += addedQuantity;
  await item.save();

  return item;
};

harvestingBatchSchema.methods.cropVarietyQuantity = async function ({
  cropVarietyName,
  cropVarietyId,
} = {}) {
  const batch = await populatedBatch(this);
  const item = batch.find((hbi) => {
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

  return item.batchQuantity;
};

harvestingBatchSchema.methods.quantities = async function () {
  const batch = await populatedBatch(this);
  const quantities = {};

  for (const item of batch.harvestingBatchItems) {
    const quantity = await item.batchQuantity;
    quantities[item.cropVariety.name] = quantity;
  }
  return quantities;
};

harvestingBatchItemSchema.pre("deleteMany", async function () {
  const ids = await HarvestingBatchItem.find(this.getFilter()).distinct("_id");
  await PlantedCropVariety.updateMany(
    { harvestingBatchItem: { $in: ids } },
    { harvestingPlanItem: null, harvestedAt: null },
  );
  await CropVariety.updateMany(
    { harvestingBatchItems: { $in: ids } },
    { $pull: { harvestingBatchItems: { $in: ids } } },
  );
});

/* harvestingBatchItemSchema.methods.quantity = async function () {
  await this.populate("cropVariety");
  return this.plantedCropVarieties.length * this.cropVariety.quantityPerCells;
}; */

export const HarvestingBatch =
  mongoose.models.HarvestingBatch ||
  mongoose.model("HarvestingBatch", harvestingBatchSchema);
export const HarvestingBatchItem =
  mongoose.models.HarvestingBatchItem ||
  mongoose.model("HarvestingBatchItem", harvestingBatchItemSchema);

const populatedBatch = async (batch) => {
  return await batch.populate({
    path: "harvestingBatchItems",
    select: "cropVariety plantedCropVarieties",
    populate: "cropVariety",
  });
};
