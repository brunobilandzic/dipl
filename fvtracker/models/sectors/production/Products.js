import { Schema } from "mongoose";
import mongoose from "mongoose";
import { CropVariety } from "../cultivation/Crops";

const productsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
    },
  ],
  stocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductStock",
    },
  ],
});

productsSchema.pre("save", async function () {
  if (this.isModified("ingredients") && this.ingredients.length > 0) {
    for (const ingredient of this.ingredients) {
      const cropVariety = await CropVariety.findOne(
        (cv) => cv.name === ingredient.cropVariety,
      );
      if (!cropVariety) {
        throw new Error(`Crop variety "${ingredient.cropVariety}" not found.`);
      }
      ingredient.cropVariety = cropVariety._id;
      cropVariety.products.push(this._id);
      await cropVariety.save();
    }
  }
});

const ingredientsSchema = new Schema({
  cropVariety: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CropVariety",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const productStockSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  harvestingBatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HarvestingBatch",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

export const Product =
  mongoose.models.Product || mongoose.model("Product", productsSchema);
export const Ingredient =
  mongoose.models.Ingredient || mongoose.model("Ingredient", ingredientsSchema);
export const ProductStock =
  mongoose.models.ProductStock ||
  mongoose.model("ProductStock", productStockSchema);
