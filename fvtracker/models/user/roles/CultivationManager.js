import mongoose from "mongoose";

const cultivationManagerSchema = {
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  cultivationAreas: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CultivationArea" },
  ],
  cropTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: "CropType" }],
  harvestSchedules: [
    { type: mongoose.Schema.Types.ObjectId, ref: "HarvestSchedule" },
  ],
  harvest: [{ type: mongoose.Schema.Types.ObjectId, ref: "Harvest" }],
  cultivationBatches: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CultivationBatch" },
  ],
};
export const CultivationManager =
  mongoose.models.CultivationManager ||
  mongoose.model(
    "CultivationManager",
    new mongoose.Schema(cultivationManagerSchema),
  );
