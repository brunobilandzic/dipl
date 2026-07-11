import mongoose from "mongoose";
const { Schema } = mongoose;
import utils from "@/lib/utils";
import { Cultivation } from "./Cultivation";
import { Field } from "./Field";

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
  mainCropType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropMainType",
    required: true,
  },
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
  quantityPerCell: { type: Number, default: 1 },
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
  plantingPlanItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantingPlanItem",
      default: [],
    },
  ],
  harvestingPlanItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HarvestingPlanItem",
      default: [],
    },
  ],
  harvestingBatchItem: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HarvestingBatchItem",
      default: [],
    },
  ],
  ingredients: [
    {
      //
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      default: [],
    },
  ],
});

cropVarietySchema.methods.products = async function () {
  await this.populate({
    path: "productIngrediets",
    select: "product quantity",
    populate: {
      product: {
        select: "name",
      },
    },
  });

  return this.productIngrediets.map((ing) => ({
    productName: ing.product.name,
    quantity: ing.quantity,
  }));
};

const plantedCropVarietySchema = new Schema({
  plantingPlanItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlantingPlanItem",
    default: null,
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
  harvestedAt: { type: Date, default: null },
  plantedAt: { type: Date, default: null },
  harvestingPlanItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HarvestingPlanItem",
    default: null,
  },
  harvestingBatchItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HarvestBatchItem",
    default: null,
  },
});

plantedCropVarietySchema.pre("deleteMany", async function () {
  const plantedCropVarieties = await this.model.find(this.getFilter());
  const cultivationIds = plantedCropVarieties.map((pcv) => pcv.cultivation);
  const cultivations = await Cultivation.find({
    _id: { $in: cultivationIds },
  }).populate({
    path: "cultivationArea",
    populate: { path: "field" },
  });
  const fieldIds = cultivations.map((c) => c.cultivationArea.field);
  const fields = await Field.find({ _id: { $in: fieldIds } });
  await Promise.all(fields.map((field) => field.save())); // to trigger fields' updatedAt change
});

plantedCropVarietySchema.pre("updateMany", async function () {
  const fieldPlcv = await this.model.findOne(this.getFilter()).populate({
    path: "cultivation",
    select: "cultivationArea",
    populate: {
      path: "cultivationArea",
      select: "field",
      populate: "field",
    },
  });
  if (!fieldPlcv) return;
  await fieldPlcv.cultivation.cultivationArea.field.save(); // to trigger field's updatedAt change
});

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

/* export const HarvestedCropVariety =
  mongoose.models.HarvestedCropVariety ||
  mongoose.model("HarvestedCropVariety", harvestedCropVarietySchema); */
