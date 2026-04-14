import { Schema } from "mongoose";
import mongoose from "mongoose";
import { CropVariety } from "../cultivation/Crops";
import { makeUrlFriendly } from "@/lib/utils/strings";
import { Base } from "@/models/Base";
import { ProductionProcess } from "./Process";
import { getHarvestingBatches } from "@/lib/cultivation/harvest/batches";
import { getProductionProcessInfos } from "@/seed/data/production";
import { ProductionFacility } from "./Facility";

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
  stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductStock",
  },
  productionProcesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Base",
      default: [],
    },
  ],
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

productSchema.methods.createStock = async function ({
  // we make sure that harvset batch has needed resources before calling this method
  harvestingBatchId,
  quantity,
  // get seed process info for 1 process
  productionProcessInfo = getProductionProcessInfos(1)[0],
}) {
  // find harvesting batch for create product
  const [harvestingBatch] = await getHarvestingBatches({
    batchIds: [harvestingBatchId],
  });
  if (!harvestingBatch) {
    throw new Error(`Harvesting batch with id ${harvestingBatchId} not found.`);
  }
  await this.populate({
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

    await batchItem.save();
  }

  const productionProcess = new ProductionProcess({
    product: this._id,
    harvestingBatch: harvestingBatchId,
    quantity,
    ...productionProcessInfo,
  });

  let stock;

  const existingStock = this.stock;

  if (existingStock) {
    existingStock.productionProcesses.push(productionProcess._id);
    existingStock.quantity += quantity;
    stock = existingStock;
  } else {
    const newStock = new ProductStock({
      product: this._id,
      harvestingBatch: harvestingBatchId,
      quantity,
      productionProcesses: [productionProcess._id],
    });
    stock = newStock;
  }

  harvestingBatch.productionProcesses.push(productionProcess._id);

  await harvestingBatch.save();
  await productionProcess.save();
  await stock.save();

  this.stocks = stock._id;
  await this.save();

  return stock;

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
    ref: "Base",
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
  productionProcesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionProcess",
      default: [],
    },
  ],
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

productStockSchema.pre("deleteMany", async function () {
  const ids = await ProductStock.find(this.getFilter()).distinct("_id");
  await ProductionProcess.deleteMany({ productStock: { $in: ids } });
  await ProductionFacility.updateMany(
    { stocks: { $in: ids } },
    { $pull: { stocks: { $in: ids } } },
  );
  await Product.updateMany(
    { stocks: { $in: ids } },
    { $pull: { stocks: { $in: ids } } },
  );
});

export const Product =
  mongoose.models.Product ||
  Base.discriminator("Product", new mongoose.Schema(productSchema));
export const Ingredient =
  mongoose.models.Ingredient || mongoose.model("Ingredient", ingredientsSchema);
export const ProductStock =
  mongoose.models.ProductStock ||
  mongoose.model("ProductStock", productStockSchema);
