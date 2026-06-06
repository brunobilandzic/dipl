import { Schema } from "mongoose";
import mongoose from "mongoose";
import { CropVariety } from "../cultivation/Crops";
import { makeUrlFriendly } from "@/lib/utils/strings";
import { Base } from "@/models/Base";
import { ProductionManager } from "@/models/user/managers/ProductionManager";
import { ProductionStock } from "./Facility";
import {
  STANDARD,
  VARIETIES_QUALITIES,
} from "@/lib/constants/cultivation/plants";

const productSchema = new Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
    },
  ],
  productionManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductionManager",
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
  productionStocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionStock",
      default: [],
    },
  ],
  warehouseStocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseStock",
      default: [],
    },
  ],
  shipmentSources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShipmentSource",
      default: [],
    },
  ],
  stockVolume: {
    type: Number,
    required: true,
  },
});

const ingredientsSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
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
  quality: {
    type: String,
    enum: VARIETIES_QUALITIES,
    default: STANDARD,
  },
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
    let cropVariety;
    if (ingredientData.cropVarietyName) {
      cropVariety = await CropVariety.findOne({
        name: ingredientData.cropVarietyName,
      });
      if (!cropVariety) {
        throw new Error(
          `Crop variety with name ${ingredientData.cropVarietyName} not found.`,
        );
      }
    } else {
      cropVariety = await CropVariety.findById(ingredientData.cropVariety);
      if (!cropVariety) {
        throw new Error(
          `Crop variety with id ${ingredientData.cropVariety} not found.`,
        );
      }
    }

    const newIngredient = new Ingredient({
      product: this._id,
      cropVariety: cropVariety._id,
      quantity: ingredientData.quantity,
      quality: ingredientData.quality || STANDARD,
    });
    cropVariety.ingredients.push(newIngredient._id);

    await cropVariety.save();
    await newIngredient.save();
    ingredients.push(newIngredient);
  }

  this.ingredients.push(...ingredients.map((ing) => ing._id));
  await this.save();
};

productSchema.pre("deleteMany", async function () {
  const ids = await Product.find(this.getFilter()).distinct("_id");
  await ProductionManager.updateMany(
    { products: { $in: ids } },
    { $pull: { products: { $in: ids } } },
  );
  await Ingredient.deleteMany({ product: { $in: ids } });
  await ProductionStock.deleteMany({ product: { $in: ids } });
  // await WarehouseStock.deleteMany({ product: { $in: ids } });
});

ingredientsSchema.pre("deleteMany", async function () {
  const ids = await Ingredient.find(this.getFilter()).distinct("_id");

  await CropVariety.updateMany(
    { ingredients: { $in: ids } },
    { $pull: { ingredients: { $in: ids } } },
  );

  await Product.updateMany(
    { ingredients: { $in: ids } },
    { $pull: { ingredients: { $in: ids } } },
  );
});

/* productStockSchema.pre("save", async function () {
  if (this.isNew) {
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
}); */

export const Product =
  mongoose.models.Product ||
  Base.discriminator("Product", new mongoose.Schema(productSchema));
export const Ingredient =
  mongoose.models.Ingredient || mongoose.model("Ingredient", ingredientsSchema);
