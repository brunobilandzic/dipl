import { CropVariety } from "@/models/sectors/cultivation/Crops";
import { products } from "../data/production";
import { Ingredient, Product } from "@/models/sectors/production/Product";
import { makeUrlFriendly } from "@/lib/utils/strings";
import { HarvestingBatch } from "@/models/sectors/interface/HarvestingBatch";
import { getBatchesWithResources } from "@/lib/utils/production/resources";

export const createProducts = async () => {
  await Product.deleteMany({}); // Clear existing products
  await Ingredient.deleteMany({}); // Clear existing ingredients
  console.log("Creating products...");
  for (const productData of products) {
    const cropVarieties = await CropVariety.find({
      name: { $in: productData.cropVarieties },
    });

    const product = new Product({
      name: productData.name,
      slug: makeUrlFriendly(productData.name),
      description: productData.description,
      price: productData.price,
    });

    await product.save();
    await product.createIngredients({
      ingredientsData: productData.ingredients,
    });
  }
};

export const createProductStockSeed = async ({ product }) => {
  console.log("Creating product stock for:", product);
  const harvestingBatches = await HarvestingBatch.find().populate({
    path: "harvestingBatchItems",
  });
  const [batchWithResources] = getBatchesWithResources({
    harvestingBatches,
    product,
    quantity: 1,
  });
  if (!batchWithResources) {
    console.log(
      "No harvesting batch with sufficient resources found for product:",
      product.name,
    );
    return;
  }
  console.log("Found batch with resources:", batchWithResources);
  await product.createStock({
    harvestingBatchId: batchWithResources._id,
    quantity: 1,
  });
};
