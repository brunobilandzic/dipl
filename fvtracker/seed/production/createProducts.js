import { productsData } from "../data/production";
import { Product } from "@/models/sectors/production/Product";
import { getBatchesWithResources } from "@/lib/utils/production/resources";
import { getHarvestingBatches } from "@/lib/cultivation/harvest/batches";
import { populateProductIngredients } from "@/lib/utils/production/products";
import { ProductionManager } from "@/models/user/managers/ProductionManager";

export const createProducts = async () => {
  await Product.deleteMany({}); // Clear existing products
  console.log("Creating products...");

  for (const productData of productsData) {
    const { ingredients, ...productBaseInfo } = productData;
    const product = new Product({
      ...productBaseInfo,
    });

    await product.save();
    await product.createIngredients({
      ingredientsData: productData.ingredients,
    });

    const stock = await createProductStockSeed({ product });
    product.stock = stock._id;
    productionManager.products.push(product._id);
    await productionManager.save();
    await product.save();
    console.log(`Created product: ${product.name}`);
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
