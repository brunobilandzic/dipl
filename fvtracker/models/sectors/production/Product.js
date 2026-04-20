import { Schema } from "mongoose";
import mongoose from "mongoose";
import { CropVariety } from "../cultivation/Crops";
import { makeUrlFriendly } from "@/lib/utils/strings";
import { Base } from "@/models/Base";
import { ProductionProcess } from "./Process";
import { getHarvestingBatches } from "@/lib/cultivation/harvest/batches";
import { getProductionProcessInfo } from "@/seed/data/production/production";
import { ProductionFacility } from "./Facility";
import { Machine } from "./Machine";

const productSchema = new Schema({
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
      default: null,
    },
  ],
  warehouseStocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseStock",
      default: null,
    },
  ],
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

const productionStockSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  processes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductionProcess",
      default: [],
    },
  ],
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
  },
});

const warehouseStockSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Base",
  },
  // add other warerhouuse stock related fields later
});

productSchema.pre("save", async function () {
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

productSchema.methods.createProductiStockBUP = async function ({
  // we make sure that harvset batch has needed resources before calling this method
  harvestingBatchId,
  quantity,
  // get seed process info for 1 process
  productionProcessInfo = getProductionProcessInfo({ productName: this.name }),
}) {
  const chooseProcess = async () => {
    const processes = await ProductionProcess.findOrCreate({
      name: productionProcessInfo.name,
      product: this._id,
    });
  };
  const deductResources = async () => {
    // find harvesting batch for create product
    const [harvestingBatch] = await getHarvestingBatches({
      batchIds: [harvestingBatchId],
    });
    if (!harvestingBatch) {
      throw new Error(
        `Harvesting batch with id ${harvestingBatchId} not found.`,
      );
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
  };

  await deductResources();

  const { machineName, ...processInfo } = productionProcessInfo;

  const machine = await Machine.findOrCreate({ name: machineName });

  const productionProcess = new ProductionProcess({
    product: this._id,
    machines: [machine._id],
    quantity,
    ...processInfo,
  });

  let stock;

  const existingStockId = this.stock;

  if (existingStockId) {
    const existingStock = await ProductStock.findById(existingStockId);
    existingStock.productionProcesses.push(productionProcess._id);
    existingStock.quantity += quantity;
    stock = existingStock;
  } else {
    const newStock = new ProductStock({
      product: this._id,
      quantity,
      productionProcesses: [productionProcess._id],
    });
    stock = newStock;
  }

  productionProcess.productStock = stock._id;
  machine.productionProcesses.push(productionProcess._id);
  await machine.save();

  await productionProcess.save();
  await stock.save();
  this.stock = stock._id;
  await this.save();
  console.log(
    `Created production process with id ${productionProcess._id} for product ${this.name}. Updated stock quantity to ${stock.quantity}.`,
  );
  return stock;

  // reduce from batch quantity
};

productSchema.pre("deleteMany", async function () {
  const ids = await Product.find(this.getFilter()).distinct("_id");
  await Ingredient.deleteMany({ product: { $in: ids } });
  await ProductionStock.deleteMany({ product: { $in: ids } });
  await ProductionProcess.deleteMany({ product: { $in: ids } });
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

productionStockSchema.pre("deleteMany", async function () {
  const ids = await ProductStock.find(this.getFilter()).distinct("_id");
  await ProductionProcess.deleteMany({ productStock: { $in: ids } });
  await ProductionFacility.updateMany(
    { stocks: { $in: ids } },
    { $pull: { stocks: { $in: ids } } },
  );
});

export const Product =
  mongoose.models.Product ||
  Base.discriminator("Product", new mongoose.Schema(productSchema));
export const Ingredient =
  mongoose.models.Ingredient || mongoose.model("Ingredient", ingredientsSchema);
export const ProductionStock =
  mongoose.models.ProductionStock ||
  mongoose.model("ProductionStock", productionStockSchema);
export const WarehouseStock =
  mongoose.models.WarehouseStock ||
  mongoose.model("WarehouseStock", warehouseStockSchema);
