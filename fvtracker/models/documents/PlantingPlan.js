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
});

const plantingPlanSchema = new Schema({
  cultivation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cultivation",
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
