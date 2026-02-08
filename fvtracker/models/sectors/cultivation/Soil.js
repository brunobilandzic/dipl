import mongoose from "mongoose";
import utils from "@/lib/utils";
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
  slug: { type: String, unique: true, index: true },
  description: { type: String, default: "" },
  goodForCrops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CropVariety",
      default: [],
    },
  ],
});

soilTypeSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = utils.strings.makeUrlFriendly(this.name);
  }
});

export const SoilType =
  mongoose.models.SoilType || mongoose.model("SoilType", soilTypeSchema);
