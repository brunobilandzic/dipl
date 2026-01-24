import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
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
  width: { type: Number, required: true }, // in number of cells
  length: { type: Number, required: true }, // in number of cells
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
  soilType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SoilType",
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

/* harvestSchedules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HarvestSchedule",
      default: [],
    },
  ],
  harvest: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Harvest", default: [] },
  ],
  cultivationBatches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CultivationBatch",
      default: [],
    },
  ], */
