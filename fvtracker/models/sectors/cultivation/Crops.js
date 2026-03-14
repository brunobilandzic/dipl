import mongoose from "mongoose";
const { Schema } = mongoose;
import utils from "@/lib/utils";

// order is cropmaintype -> cropgeneratype -> croptype -> cropvariety

const mainCropTypeSchema = new Schema({
  name: { type: String, required: true },
  generalTypes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CropGeneralType",
      default: [],
    },
  ],
});

// crop general type (cereal, vegetable, fruit..)
const cropGeneralTypeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  cropTypes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CropType", default: [] },
  ],
});

// crop type // e.g tomato, eggplant...
const cropTypeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  color: {
    type: String,
    required: true,
    enum: [
      "slate",
      "gray",
      "zinc",
      "neutral",
      "stone",
      "red",
      "orange",
      "amber",
      "yellow",
      "lime",
      "green",
      "emerald",
      "teal",
      "cyan",
      "sky",
      "blue",
      "indigo",
      "violet",
      "purple",
      "fuchsia",
      "pink",
      "rose",
    ],
    defailt: "green",
  },
  generalType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropGeneralType",
    required: true,
  },
  cropVarieties: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CropVariety", default: [] },
  ],
});

// crop variety e.g cherry tomato, beefsteak tomato...
const cropVarietySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  shade: {
    type: Number,
    enum: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    default: 500,
  },
  cropType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropType",
    required: true,
  },
  plantedCropVarieties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantedCropVariety",
      default: [],
    },
  ],
});

const plantedCropVarietySchema = new Schema({
  cropVariety: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropVariety",
    default: null
  },
  cultivation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cultivation",
    required: true,
  },
  relativeCoords: {
    type: String,
    default: null,
    validate: (coords) => {
      if (coords && !utils.strings.testCoordinates(coords)) {
        throw new Error(
          "Invalid cell coordinates format. Expected format: 'x,y'",
        );
      }
    },
  },
  fieldCoords: {
    type: String,
    default: null,
    validate: (coords) => {
      if (coords && !utils.strings.testCoordinates(coords)) {
        throw new Error(
          "Invalid field coordinates format. Expected format: 'x,y'",
        );
      }
    },
  },
  plantedAt: { type: Date, default: null },
  harvestedAt: { type: Date, default: null },
  //harvest..
});

const plantingPlanSchema = new Schema({
  cultivation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cultivation",
    required: true,
  },
  cropVariety: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropVariety",
    required: true,
  },
  quantity: {
    type: Number,
    defult: 0,
  },
  plannedPlantingDate: {
    type: Date,
    default: null,
  },
  plannedHarvestingDate: {
    type: Date,
    default: null,
  },
});

// model exports

export const CropMainType =
  mongoose.models.CropMainType ||
  mongoose.model("CropMainType", mainCropTypeSchema);

export const CropGeneralType =
  mongoose.models.CropGeneralType ||
  mongoose.model("CropGeneralType", cropGeneralTypeSchema);

export const CropType =
  mongoose.models.CropType || mongoose.model("CropType", cropTypeSchema);

export const CropVariety =
  mongoose.models.CropVariety ||
  mongoose.model("CropVariety", cropVarietySchema);

export const PlantedCropVariety =
  mongoose.models.PlantedCropVariety ||
  mongoose.model("PlantedCropVariety", plantedCropVarietySchema);

export const PlantingPlan =
  mongoose.models.PlantingPlan ||
  mongoose.model("PlantingPlan", plantingPlanSchema);