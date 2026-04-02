import { Schema } from "mongoose";
import mongoose from "mongoose";
import { CropVariety } from "../cultivation/Crops";
import { makeUrlFriendly } from "@/lib/utils/strings";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  ingredients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      default: [],
    },
  ],
  stocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductStock",
    },
  ],
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

productSchema.pre("save", function () {
  if (this.isModified("name") || this.isNew) {
    this.slug = makeUrlFriendly(this.name);
  }
});

productSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  console.log("Pre-update hook triggered with update:", update);
  if (update.name) {
    update.slug = makeUrlFriendly(update.name);
    console.log("Updated slug to:", update.slug);
  }
});

productSchema.methods.createIngredients = async function ({ ingredientsData }) {
  const ingredients = [];
  for (const ingredientData of ingredientsData) {
    const cropVariety = await CropVariety.findOne({
      name: ingredientData.cropVarietyName,
    });
    if (!cropVariety) {
      throw new Error(
        `Crop variety ${ingredientData.cropVarietyName} not found.`,
      );
    }

    const newIngredient = new Ingredient({
      product: this._id,
      cropVariety: cropVariety._id,
      quantity: ingredientData.quantity,
    });
    cropVariety.ingredients.push(newIngredient._id);

    await cropVariety.save();
    await newIngredient.save();
    ingredients.push(newIngredient);
  }

  this.ingredients.push(...ingredients.map((ing) => ing._id));
  await this.save();
};

const ingredientsSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
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

productStockSchema.pre("save", async function () {
  if (this.isNew()) {
    await this.populate([
      {
        path: "product",
        select: "ingredients",
      },
      {
        path: "harvestingBatch",
        select: "harvestingBatchItems",
        select: "cropVariety quantity",
      },
    ]);
  }
});

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export const Ingredient =
  mongoose.models.Ingredient || mongoose.model("Ingredient", ingredientsSchema);
export const ProductStock =
  mongoose.models.ProductStock ||
  mongoose.model("ProductStock", productStockSchema);
