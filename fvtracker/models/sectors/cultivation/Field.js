import mongoose from "mongoose";
import { CultivationArea } from "./Cultivation";
import utils from "@/lib/utils";

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, default: "" },
  dimensions: {
    type: {
      width: { type: Number, required: true }, // in number of cells
      length: { type: Number, required: true }, // in number of cells
    },
    required: true,
  },
  cultivationAreaDimensions: {
    type: {
      min_ca_dim: { type: Number, required: true },
      max_ca_dim: { type: Number, required: true },
      gap: { type: Number, required: true }, // gap between cultivation areas in number of cells
    },
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CultivationManager",
    required: true,
  },
  cultivationAreas: [
    {
      // areas in field with the same soil type that are made of specfic field grid cells
      type: mongoose.Schema.Types.ObjectId,
      ref: "CultivationArea",
      default: [],
    },
  ],
  plantingPlans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantingPlan",
      default: [],
    },
  ],
  harvestingPlans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HarvestingPlan",
      default: [],
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

fieldSchema.methods.addCultivationArea = async function (cultivationArea) {
  const newCultivationArea = new CultivationArea({
    ...cultivationArea,
    field: this._id,
  });

  await newCultivationArea.save();
  this.cultivationAreas.push(newCultivationArea._id);
};

fieldSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = utils.strings.makeUrlFriendly(this.name);
  }
  this.updatedAt = Date.now();
});

/* const fieldGridCell = new mongoose.Schema({zapi
  // square cell in the field grid
  // has 1x1 size
  row: { type: Number, required: true },
  column: { type: Number, required: true },
  turnedOn: { type: Boolean, default: true },
  cultivationArea: {
    // cell can belong to only one cultivation area (like places where the soil is some type of soil good for some crops)
    type: mongoose.Schema.Types.ObjectId,
    ref: "CultivationArea",
    default: null,
  },
  cultivation: {
    // something is planted in the cell
    // if null, cell is empty
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cultivation",
    default: null,
  },
});
export const FieldGridCell =
  mongoose.models.FieldGridCell ||
  mongoose.model("FieldGridCell", fieldGridCell); */

export const Field =
  mongoose.models.Field || mongoose.model("Field", fieldSchema);
