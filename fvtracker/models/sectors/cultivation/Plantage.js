import { AppUser } from "@/models/user/AppUser";
import { Schema } from "mongoose";
import mongoose from "mongoose";

const plantageSchema = new Schema(
  {
    cultivation: {
      type: Schema.Types.ObjectId,
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
    worker: {
      type: Schema.Types.ObjectId,
      ref: "CultivationWorker",
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
plantageSchema.pre("save", async function () {
  if (!this.isNew) return;
  await this.populate("plantingPlan");
  const plantingPlan = this.plantingPlan;
  if (!plantingPlan) {
    throw new Error("Associated planting plan not found");
  }
  plantingPlan.plantages.push(this._id);
  await plantingPlan.save();
  await this.populate("cultivation");
  const cultivation = this.cultivation;
  if (!cultivation) {
    throw new Error("Associated cultivation not found");
  }
  console.log({ cultivation });
  cultivation.plantages.push(this._id);
  await cultivation.save();
});

plantageItemSchema.pre("save", async function () {
  if (!this.isNew) return;
  await this.populate("plantage");
  const plantage = this.plantage;
  if (!plantage) {
    throw new Error("Associated plantage not found");
  }
  plantage.plantageItems.push(this._id);
  await plantage.save();
  await this.populate("plantingPlanItem");
  const plantingPlanItem = this.plantingPlanItem;

  if (!plantingPlanItem) {
    throw new Error("Associated planting plan item not found");
  }
  plantingPlanItem.plantageItems.push(this._id);
  await plantingPlanItem.save();
});

export const Plantage =
  mongoose.models.Plantage || mongoose.model("Plantage", plantageSchema);
export const PlantageItem =
  mongoose.models.PlantageItem ||
  mongoose.model("PlantageItem", plantageItemSchema);
