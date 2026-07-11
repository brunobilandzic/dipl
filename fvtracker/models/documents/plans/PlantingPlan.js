import mongoose from "mongoose";
import { Field } from "@/models/sectors/cultivation/Field";
import { makeUrlFriendly } from "@/lib/utils/strings";
import {
  CropVariety,
  PlantedCropVariety,
} from "@/models/sectors/cultivation/Crops";

const { Schema } = mongoose;

const plantingPlanItemSchema = new Schema({
  cropVariety: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropVariety",
    required: true,
  },
  quantity: {
    type: Number,
    validate: {
      validator: function (v) {
        return v >= 0;
      },
      message: "Količina ne smije biti manja ili jednaka nuli",
    },
    required: true,
  },
  plantingPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlantingPlan",
    required: true,
  },
  plantedCropVarieties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantedCropVariety",
      default: [],
    },
  ],
  plantageWorks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantageWork",
    },
  ],
});

plantingPlanItemSchema.pre("deleteMany", async function () {
  const ids = await PlantingPlanItem.find(this.getFilter()).distinct("_id");
  await PlantedCropVariety.updateMany(
    { plantingPlanItem: { $in: ids } },
    { plantingPlanItem: null },
  );
  await CropVariety.updateMany(
    { plantingPlanItems: { $in: ids } },
    { $pull: { plantingPlanItems: { $in: ids } } },
  );
});

const plantingPlanSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlantingPlanItem",
        default: [],
      },
    ],
    plannedHarvestingDate: {
      type: Date,
      default: null,
    },
    slug: { type: String, unique: true, index: true },
  },
  { timestamps: true },
);

plantingPlanSchema.pre("save", async function () {
  if (this.isModified("name")) {
    const field = await Field.findById(this.field);
    this.slug = makeUrlFriendly(`${field?.name}-${this.name}`);
  }
});

plantingPlanSchema.pre("deleteMany", async function () {
  const ids = await PlantingPlan.find(this.getFilter()).distinct("_id");
  await PlantingPlanItem.deleteMany({ plantingPlan: { $in: ids } });
  await Field.updateOne(
    {
      plantingPlans: { $in: [this._id] },
    },
    { $pull: { plantingPlans: this._id } },
  );
});

export const PlantingPlan =
  mongoose.models.PlantingPlan ||
  mongoose.model("PlantingPlan", plantingPlanSchema);

export const PlantingPlanItem =
  mongoose.models.PlantingPlanItem ||
  mongoose.model("PlantingPlanItem", plantingPlanItemSchema);
