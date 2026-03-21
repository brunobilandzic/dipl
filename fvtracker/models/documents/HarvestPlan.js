import mongoose from "mongoose";
import { Field } from "@/models/sectors/cultivation/Field";
import { makeUrlFriendly } from "@/lib/utils/strings";

const { Schema } = mongoose;

const harvestItemSchema = new Schema({
  cropVariety: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropVariety",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  harvestPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HarvestPlan",
    required: true,
  },
});

const harvestPlanSchema = new Schema({
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
      ref: "HarvestPlanItem",
      default: [],
    },
  ],
  plannedHarvestingDate: {
    type: Date,
    default: null,
  },
  slug: { type: String, unique: true, index: true },
});

harvestPlanSchema.pre("save", async function () {
  if (this.isModified("name")) {
    const field = await Field.findById(this.field);
    this.slug = makeUrlFriendly(`${field?.name}-${this.name}`);
  }
});

export const HarvestPlan =
  mongoose.models.HarvestPlan ||
  mongoose.model("HarvestPlan", harvestPlanSchema);

export const HarvestPlanItem =
  mongoose.models.HarvestPlanItem ||
  mongoose.model("HarvestPlanItem", harvestItemSchema);
