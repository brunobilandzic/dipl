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
  cultivations: [
    // cultivation is consisted of cultivation cycles, eaych cycle of its own areas and crops
    { type: mongoose.Schema.Types.ObjectId, ref: "Cultivation", default: [] },
  ],
  location: {
    // defines cells beginning location in the field
    // cells are expanding in the first quadrant from this point
    // it is used for mapping field on real world map
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    required: true,
  },
});

fieldSchema.methods.addCultivationArea = async function (cultivationArea) {
  const { name, description, fieldGridCells } = cultivationArea;
  const newCultivationArea = new CultivationArea({
    name,
    description,
    field: this._id,
  });

  const gridCells = fieldGridCells.map((cell) => ({
    row: cell.row,
    column: cell.col,
    cultivationArea: newCultivationArea._id,
  }));

  const insertedCells = await FieldGridCell.insertMany(gridCells);
  newCultivationArea.fieldGridCells = insertedCells.map((c) => c._id);

  this.cultivationAreas.push(newCultivationArea._id);
  await newCultivationArea.save();
};

fieldSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = utils.strings.makeUrlFriendly(this.name);
  }
});

const fieldGridCell = new mongoose.Schema({
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

export const Field =
  mongoose.models.Field || mongoose.model("Field", fieldSchema);
export const FieldGridCell =
  mongoose.models.FieldGridCell ||
  mongoose.model("FieldGridCell", fieldGridCell);
