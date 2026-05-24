import mongoose from "mongoose";
const { Schema } = mongoose;

const plantageSchema = new Schema({
  cultivation: {
    type: Schema.Types.ObjectId,
    ref: "Cultivation",
    required: true,
  },
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
});

export const Plantage =
  mongoose.models.Plantage || mongoose.model("Plantage", plantageSchema);
