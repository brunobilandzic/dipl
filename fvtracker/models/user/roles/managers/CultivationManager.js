import mongoose from "mongoose";

const cultivationManagerSchema = {
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  cultivationAreas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CultivationArea",
      default: [],
    },
  ],
  cropTypes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CropType", default: [] },
  ],
  harvestSchedules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HarvestSchedule",
      default: [],
    },
  ],
  harvest: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Harvest", default: [] },
  ],
  cultivationBatches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CultivationBatch",
      default: [],
    },
  ],
};
export const CultivationManager =
  mongoose.models.CultivationManager ||
  mongoose.model(
    "CultivationManager",
    new mongoose.Schema(cultivationManagerSchema),
  );
