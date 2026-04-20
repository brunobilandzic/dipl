import { productsData } from "../data/production/products";
import { Product } from "@/models/sectors/production/Product";
import { getBatchesWithResources } from "@/lib/utils/production/resources";
import { getHarvestingBatches } from "@/lib/cultivation/harvest/batches";
import { populateProductIngredients } from "@/lib/production/product/ingredients";
import { ProductionManager } from "@/models/user/managers/ProductionManager";
import { createFacility } from "./facility";
import { createProductStock } from "@/lib/production/stocks";

export const createProducts = async () => {
  await Product.deleteMany({}); // Clear existing products
  console.log("Creating products...");
  const productionFacility = await createFacility();
  const productionManager = await ProductionManager.findOne();
  for (const productData of productsData) {
    const { ingredients, ...productBaseInfo } = productData;
    const product = new Product({
      ...productBaseInfo,
      productionManager: productionManager._id,
    });
    await product.save();
    await product.createIngredients({
      ingredientsData: productData.ingredients,
    });

    const productionStock = await createProductStockSeed({
      product,
      productionFacilityId: productionFacility._id,
    });
    productionManager.products.push(product._id);
    await productionManager.save();
    await product.save();
    console.log(`Created product: ${product.name}`);
  }
};

export const createProductStockSeed = async ({
  product,
  productionFacilityId,
}) => {
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
  const productionStock = await createProductStock({
    productId: product._id,
    harvestingBatchId: batchWithResources._id,
    quantity: 1,
    productionFacilityId,
  });
  product.productionStocks.push(productionStock._id);
  console.log(
    "Created stock for product:",
    product.name,
    "\n",
    productionStock,
  );
  return productionStock;
};
