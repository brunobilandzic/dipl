import { Schema } from "mongoose";
import mongoose from "mongoose";
import { CropVariety } from "../cultivation/Crops";

const productsSchema = new Schema({
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
});

productsSchema.methods.createIngredients = async function ({
  ingredientsData,
}) {
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

/* productsSchema.pre("save", async function () {
  console.log(this._doc);
  if (!this.ingredients || this.ingredients.length === 0) {
    throw new Error("Product must have at least one ingredient.");
  }
  console.log({
    ingredients: this.ingredients,
  });
  if (this.isNew()) {
    // ingredients come in pairs of {name, quantity}
    for (const ingredient of this.ingredients) {
      const cropVariety = await CropVariety.findOne(
        (cv) => cv.name === ingredient.cropVariety,
      );
      if (!cropVariety) {
        throw new Error(`Crop variety "${ingredient.cropVariety}" not found.`);
      }

      const newIngredient = new Ingredient({
        product: this._id,
        cropVariety: cropVariety._id,
        quantity: ingredient.quantity,
      });
      console.log({ newIngredient });
      ingredient.cropVariety = cropVariety._id;
      cropVariety.ingredients.push(newIngredient._id);

      await cropVariety.save();
      await newIngredient.save();
    }
  }
}); */

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
  mongoose.models.Product || mongoose.model("Product", productsSchema);
export const Ingredient =
  mongoose.models.Ingredient || mongoose.model("Ingredient", ingredientsSchema);
export const ProductStock =
  mongoose.models.ProductStock ||
  mongoose.model("ProductStock", productStockSchema);
