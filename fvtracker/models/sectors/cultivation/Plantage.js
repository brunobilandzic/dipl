import { AppUser } from "@/models/user/AppUser";
import { Schema } from "mongoose";

const plantageSchema = new Schema(
  {
    cultivation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cultivation",
      required: true,
    },
    plantingPlan: {
      type: Schema.Types.ObjectId,
      ref: "PlantingPlan",
      required: true,
    },
    plantedItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "PlantedCropVariety",
      },
    ],
    workerUsername: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const plantedItemSchema = new Schema({
  plantage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plantage",
  },
  cropVariety: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropVariety",
  },
  relativeCoords: {
    type: [String],
    default: [],
    required: true,
  },
});

plantageSchema.methods.workerAppUser = async function () {
  const appUser = await AppUser.findOne({ username: this.workerUsername });
  return appUser;
};

export const Plantage =
  mongoose.models.Plantage || mongoose.model("Plantage", plantageSchema);
export const PlantedItem =
  mongoose.models.PlantedItem ||
  mongoose.model("PlantedItem", plantedItemSchema);
