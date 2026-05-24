import mongoose from "mongoose";
const { Schema } = mongoose;

const plantageSchema = new Schema({
  plantedAt: {
    type: Date,
    default: Date.now,
  },
  plantedCropVarieties: [
    {
      type: Schema.Types.ObjectId,
      ref: "PlantedCropVariety",
      required: true,
    },
  ],
  work: {
    type: Schema.Types.ObjectId,
    ref: "PlantageWork",
    required: true,
  },
});

export const Plantage =
  mongoose.models.Plantage || mongoose.model("Plantage", plantageSchema);
