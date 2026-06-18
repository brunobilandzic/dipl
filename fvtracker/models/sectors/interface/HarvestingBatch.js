import { Schema } from "mongoose";
import mongoose from "mongoose";
import { CropVariety, PlantedCropVariety } from "../cultivation/Crops";
import {
  CultivationWorker,
  HarvestWork,
} from "@/models/user/workers/CultivationWork";
import {
  BASIC,
  STANDARD,
  VARIETIES_QUALITIES,
} from "@/lib/constants/cultivation/plants";

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
});

const harvestingBatchItemSchema = new Schema({
  harvestingBatch: {
    type: Schema.Types.ObjectId,
    ref: "HarvestingBatch",
    required: true,
  },
  quality: {
    type: String,
    enum: VARIETIES_QUALITIES,
    default: STANDARD,
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
  productionProcesses: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProductionProcess",
      default: [],
    },
  ],
  harvestWorks: [
    {
      type: Schema.Types.ObjectId,
      ref: "HarvestWork",
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
  quality,
}) {
  let item = await HarvestingBatchItem.findOne({
    harvestingBatch: this._id,
    cropVariety: cropVarietyId,
    quality,
  });
  if (!item) {
    item = new HarvestingBatchItem({
      harvestingBatch: this._id,
      cropVariety: cropVarietyId,
      quality,
    });
    this.harvestingBatchItems.push(item._id);
  }

  await item.save();
  await this.save();
  return item;
};

harvestingBatchSchema.methods.addPlantedCropVarieties = async function ({
  harvestingPlanItem,
  plantedCropVarietiesIds,
  cropVarietyId,
  quality = STANDARD,
  workerId,
  cultivationId,
  harvestedCoords,
}) {
  harvestingPlanItem.plantedCropVarieties.push(plantedCropVarietiesIds);
  harvestingPlanItem.quantity -=
    plantedCropVarietiesIds.length *
    harvestingPlanItem.cropVariety.quantityPerCell;
  if (harvestingPlanItem.quantity < 0) {
    harvestingPlanItem.quantity = 0; // Ensure quantity doesn't go negative
  }

  await PlantedCropVariety.updateMany(
    { _id: { $in: plantedCropVarietiesIds } },
    { harvestingPlanItem: harvestingPlanItem._id, harvestedAt: new Date() },
  );

  const harvestingBatchItem = await this.findOrCreateItemForCropVariety({
    cropVarietyId: cropVarietyId,
    quality,
  });
  harvestingBatchItem.plantedCropVarieties.push(...plantedCropVarietiesIds);
  const addedQuantity = plantedCropVarietiesIds.length * quantityPerCell;
  harvestingBatchItem.batchQuantity += addedQuantity;

  await harvestingBatchItem.addHarvestWork({
    hoursWorked: plantedCropVarietiesIds.length,
    worker: workerId,
    cultivation: cultivationId,
    harvestingPlanItem: harvestingPlanItem._id,
    harvestedCoords: plantedCropVarietiesIds.map((plcv) => plcv.relativeCoords),
  });

  await harvestingPlanItem.save();
};

harvestingBatchSchema.methods.addPlantedCropVarieties_bup = async function ({
  plantedCropVarietiesIds,
  cropVarietyId,
  quantityPerCell,
  quality = STANDARD,
}) {
  // Find or create the corresponding HarvestingBatchItem
  const item = await this.findOrCreateItemForCropVariety({
    cropVarietyId: cropVarietyId,
    quality,
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
  quality = STANDARD,
} = {}) {
  const batch = await populatedBatch(this);
  const item = batch.find((hbi) => {
    if (cropVarietyId) {
      return (
        hbi.cropVariety._id.equals(cropVarietyId) && hbi.quality === quality
      );
    } else if (cropVarietyName) {
      return (
        hbi.cropVariety.name === cropVarietyName && hbi.quality === quality
      );
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

harvestingBatchItemSchema.pre("save", async function () {
  if (this.isModified("batchQuantity")) {
    if (this.batchQuantity < 0) {
      throw new Error("Batch quantity cannot be negative.");
    }
  }
});

harvestingBatchItemSchema.methods.addHarvestWork = async function ({
  worker,
  hoursWorked,
  cultivation,
  harvestingPlanItem,
  harvestedCoords,
}) {
  const harvestWork = new HarvestWork({
    harvestingBatchItem: this._id,
    hoursWorked,
    worker,
    cultivation,
    harvestingPlanItem,
    harvestedCoords,
  });

  this.harvestWorks.push(harvestWork._id);

  await this.save();
  await harvestWork.save();

  return harvestWork;
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
  await HarvestWork.deleteMany({ harvestingBatchItem: { $in: ids } });
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
