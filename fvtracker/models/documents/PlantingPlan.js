import mongoose from "mongoose";
const { Schema } = mongoose;

const plantingPlanSchema = new Schema({
  cultivation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cultivation",
    required: true,
  },
  cropVariety: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropVariety",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
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
