import mongoose from "mongoose";
const { Schema } = mongoose;

const plantageSchema = new Schema({
  plantedAt: {
    type: Date,
    default: Date.now,
  },
  plantedCropVarieties: [
    {
      type: Schema.types.ObjectId,
      ref: "PlantedCropVariety",
      required: true,
    },
  ],
  cultivationWorker: {
    type: Schema.Types.ObjectId,
    ref: "CultivationWorker",
    required: true,
  },
});

export const Plantage =
  mongoose.models.Plantage || mongoose.model("Plantage", plantageSchema);
