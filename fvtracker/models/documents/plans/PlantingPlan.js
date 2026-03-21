import mongoose from "mongoose";
import { Field } from "@/models/sectors/cultivation/Field";
import { makeUrlFriendly } from "@/lib/utils/strings";

const { Schema } = mongoose;

const plantingItemSchema = new Schema({
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
  plantingPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlantingPlan",
    required: true,
  },
});

const plantingPlanSchema = new Schema({
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
      ref: "PlantingPlanItem",
      default: [],
    },
  ],
  plannedPlantingDate: {
    type: Date,
    default: null,
  },
  plannedHarvestingDate: {
    type: Date,
    default: null,
  },
  slug: { type: String, unique: true, index: true },
});

plantingPlanSchema.pre("save", async function () {
  if (this.isModified("name")) {
    const field = await Field.findById(this.field);
    this.slug = makeUrlFriendly(`${field?.name}-${this.name}`);
  }
});

export const PlantingPlan =
  mongoose.models.PlantingPlan ||
  mongoose.model("PlantingPlan", plantingPlanSchema);

export const PlantingPlanItem =
  mongoose.models.PlantingPlanItem ||
  mongoose.model("PlantingPlanItem", plantingItemSchema);
