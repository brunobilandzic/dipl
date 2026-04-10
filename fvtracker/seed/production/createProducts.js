import { CropVariety } from "@/models/sectors/cultivation/Crops";
import { products } from "../data/production";
import { Product } from "@/models/sectors/production/Product";
import { makeUrlFriendly } from "@/lib/utils/strings";
import { getBatchesWithResources } from "@/lib/utils/production/resources";
import { getHarvestingBatches } from "@/lib/cultivation/harvest/batches";
import { populateProductIngredients } from "@/lib/utils/production/products";

export const createProducts = async () => {
  await Product.deleteMany({}); // Clear existing products
  console.log("Creating products...");
  for (const productData of products) {
    const cropVarieties = await CropVariety.find({
      name: { $in: productData.cropVarieties },
    });

    const product = new Product({
      name: productData.name,
      description: productData.description,
      price: productData.price,
    });

    await product.save();
    await product.createIngredients({
      ingredientsData: productData.ingredients,
    });
    const stock = await createProductStockSeed({ product });
  }
};

export const createProductStockSeed = async ({ product }) => {
  await populateProductIngredients({ products: [product] });

  const harvestingBatches = await getHarvestingBatches();
  const [batchWithResources] = getBatchesWithResources({
    harvestingBatches,
    product,
    quantity: 1,
  });
  if (!batchWithResources) {
    return;
  }
  const stock = await product.createStock({
    harvestingBatchId: batchWithResources._id,
    quantity: 1,
  });
  console.log(
    "Created stock for product:",
    product.name,
    "Stock ID:",
    stock._id,
  );
  return stock;
};

export const plantProductsIngredients = async ({ ingredients }) => {
  await populateProductIngredients({ products });
  await addPlanItems({ ingredients, plant: true });
};
