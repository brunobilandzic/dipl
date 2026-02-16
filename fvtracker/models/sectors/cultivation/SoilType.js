import mongoose from "mongoose";
import utils from "@/lib/utils";
const { Schema } = mongoose;

const soilTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: "Neodređena vrsta tla",
  },
  slug: { type: String, unique: true, index: true },
  description: { type: String, default: "" },
  goodForCropGeneralTypes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CropGeneralType",
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
