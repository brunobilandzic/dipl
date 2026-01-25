import mongoose from "mongoose";
const { Schema } = mongoose;

const soilTypeSchema = new Schema({
  name: {
    type: String,
    enum: [
      "pjeskovito",
      "ilovasto",
      "glinasto",
      "crnica",
      "crvenica",
      "vapnenačko",
      "šljunkovito",
      "muljevito",
    ],
  },
  description: { type: String, default: "" },
  goodForCrops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CropVariety",
      default: [],
    },
  ],
});

export const SoilType =
  mongoose.models.SoilType || mongoose.model("SoilType", soilTypeSchema);
