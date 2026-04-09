import { Schema } from "mongoose";
import mongoose from "mongoose";
import { CropVariety } from "../cultivation/Crops";
import { makeUrlFriendly } from "@/lib/utils/strings";
import { Base } from "@/models/Base";

const productSchema = new Schema({
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
  this.updatedAt = new Date();
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
    });
    cropVariety.ingredients.push(newIngredient._id);

    await cropVariety.save();
    await newIngredient.save();
    ingredients.push(newIngredient);
  }

  this.ingredients.push(...ingredients.map((ing) => ing._id));
  await this.save();
};

productSchema.methods.addProductStock = async function ({
  harvestingBatchId,
  quantity,
}) {
  // find harvesting batch for create product
  const harvestingBatch = await mongoose
    .model("HarvestingBatch")
    .findById(harvestingBatchId)
    .populate("harvestingBatchItems");
  if (!harvestingBatch) {
    throw new Error(`Harvesting batch with id ${harvestingBatchId} not found.`);
  }
  this.populate({
    path: "ingredients",
    populate: {
      path: "cropVariety",
    },
  });
  for (const ingredient of this.ingredients) {
    const batchItem = harvestingBatch.harvestingBatchItems.find((item) =>
      item.cropVariety.equals(ingredient.cropVariety._id),
    );
    if (!batchItem) {
      throw new Error(
        `No matching harvesting batch item found for ingredient with crop variety ${ingredient.cropVariety.name}.`,
      );
    }
    if (batchItem.batchQuantity < ingredient.quantity * quantity) {
      throw new Error(
        `Not enough quantity in harvesting batch for ingredient with crop variety ${ingredient.cropVariety.name}. Required: ${ingredient.quantity * quantity}, Available: ${batchItem.batchQuantity}`,
      );
    }
    batchItem.batchQuantity -= ingredient.quantity * quantity;
  }

  const productionProcess = new ProductionProcess({
    product: this._id,
    harvestingBatch: harvestingBatchId,
    quantity,
  });

  const newStock = new ProductStock({
    product: this._id,
    harvestingBatch: harvestingBatchId,
    quantity,
    productionProcesses: [productionProcess._id],
  });
  // reduce from batch quantity
};

productSchema.pre("deleteMany", async function () {
  const ids = await Product.find(this.getFilter()).distinct("_id");
  await Ingredient.deleteMany({ product: { $in: ids } });
  await ProductStock.deleteMany({ product: { $in: ids } });
});

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
  mongoose.models.Product ||
  Base.discriminator("Product", new mongoose.Schema(productSchema));
export const Ingredient =
  mongoose.models.Ingredient || mongoose.model("Ingredient", ingredientsSchema);
export const ProductStock =
  mongoose.models.ProductStock ||
  mongoose.model("ProductStock", productStockSchema);
