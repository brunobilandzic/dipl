import mongoose from "mongoose";
import { getDraftModeProviderForCacheScope } from "next/dist/server/app-render/work-unit-async-storage.external";
const { Schema } = mongoose;

// order is cropmaintype -> cropgeneratype -> croptype -> cropvariety

const mainCropTypeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
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
  generalType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropGeneralType",
    required: true,
  },
  varieties: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CropVariety", default: [] },
  ],
});

// crop variety e.g cherry tomato, beefsteak tomato...
const cropVarietySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropType",
    required: true,
  },
  soilTypes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "SoilType", default: [] },
  ],
  classification: { type: String, enum: ["A", "B", "C"] },
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
