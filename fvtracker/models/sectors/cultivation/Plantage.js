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
    plantageItems: [
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

const plantageItemSchema = new Schema({
  plantage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plantage",
  },
  plantingPlanItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlantingPlanItem",
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
export const PlantageItem =
  mongoose.models.PlantageItem ||
  mongoose.model("PlantageItem", plantageItemSchema);
