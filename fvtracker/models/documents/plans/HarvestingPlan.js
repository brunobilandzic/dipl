import mongoose from "mongoose";
import { Field } from "@/models/sectors/cultivation/Field";
import { makeUrlFriendly } from "@/lib/utils/strings";
import { HarvestingBatch } from "@/models/sectors/interface/HarvestingBatch";
import { ProductionManager } from "@/models/user/managers/ProductionManager";

const { Schema } = mongoose;

const harvestingItemSchema = new Schema({
  cropVariety: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropVariety",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  plantedCropVarieties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantedCropVariety",
      default: [],
    },
  ],
  harvestingPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HarvestingPlan",
    required: true,
  },
});

harvestingItemSchema.pre("deleteMany", async function () {
  const ids = await HarvestingPlanItem.find(this.getFilter()).distinct("_id");
  await PlantedCropVariety.updateMany(
    { harvestingPlanItem: { $in: ids } },
    { harvestingPlanItem: null, harvestedAt: null },
  );
  await CropVariety.updateMany(
    { harvestingPlanItems: { $in: ids } },
    { $pull: { harvestingPlanItems: { $in: ids } } },
  );
});

const harvestingPlanSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
    required: true,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HarvestingPlanItem",
      default: [],
    },
  ],
  plannedharvestingDate: {
    type: Date,
    default: null,
  },
  plannedHarvestingDate: {
    type: Date,
    default: null,
  },
  harvestingBatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HarvestingBatch",
    default: null,
  },
  slug: { type: String, unique: true, index: true },
  productionManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductionManager",
    required: true,
  },
});

harvestingPlanSchema.pre("save", async function () {
  if (this.isModified("name")) {
    const field = await Field.findById(this.field);
    this.slug = makeUrlFriendly(`${field?.name}-${this.name}`);
  }
  if (!this.harvestingBatch) {
    const harvestingBatch = new HarvestingBatch({
      harvestingPlan: this._id,
      name: `${this.name} Žetva`,
    });
    await harvestingBatch.save();
    this.harvestingBatch = harvestingBatch._id;
  }
  if (this.isNew) {
    const productionManager = await ProductionManager.findById(
      this.productionManager,
    );
    productionManager.harvestingPlans.push(this._id);
    await productionManager.save();
  }
});

harvestingPlanSchema.pre("deleteMany", async function () {
  const ids = await HarvestingPlan.find(this.getFilter()).distinct("_id");
  await HarvestingPlanItem.deleteMany({ harvestingPlan: { $in: ids } });
  await ProductionManager.findByIdAndUpdate(this.productionManager, {
    $pull: { harvestingPlans: { $in: ids } },
  });
});

export const HarvestingPlan =
  mongoose.models.HarvestingPlan ||
  mongoose.model("HarvestingPlan", harvestingPlanSchema);

export const HarvestingPlanItem =
  mongoose.models.HarvestingPlanItem ||
  mongoose.model("HarvestingPlanItem", harvestingItemSchema);
