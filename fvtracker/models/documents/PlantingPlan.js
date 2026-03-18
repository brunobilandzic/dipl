import mongoose from "mongoose";
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
});

const plantingPlanSchema = new Schema({
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
    required: true,
  },
  items: [plantingItemSchema],
  plannedPlantingDate: {
    type: Date,
    default: null,
  },
  plannedHarvestingDate: {
    type: Date,
    default: null,
  },
});

export const PlantingPlan =
  mongoose.models.PlantingPlan ||
  mongoose.model("PlantingPlan", plantingPlanSchema);

export const PlantingPlanItem =
  mongoose.models.PlantingPlanItem ||
  mongoose.model("PlantingPlanItem", plantingItemSchema);
