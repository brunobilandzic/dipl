import mongoose from "mongoose";
import { Field } from "@/models/sectors/cultivation/Field";
import { makeUrlFriendly } from "@/lib/utils/strings";

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
  harvestingBatch:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HarvestBatch",
      default: [],
    },
  ,
  slug: { type: String, unique: true, index: true },
});

harvestingPlanSchema.pre("save", async function () {
  if (this.isModified("name")) {
    const field = await Field.findById(this.field);
    this.slug = makeUrlFriendly(`${field?.name}-${this.name}`);
  }
});

export const HarvestingPlan =
  mongoose.models.HarvestingPlan ||
  mongoose.model("HarvestingPlan", harvestingPlanSchema);

export const HarvestingPlanItem =
  mongoose.models.HarvestingPlanItem ||
  mongoose.model("HarvestingPlanItem", harvestingItemSchema);
