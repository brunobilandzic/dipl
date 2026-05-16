import { productsData } from "../data/production/products";
import { Product } from "@/models/sectors/production/Product";
import { getBatchesWithResources } from "@/lib/utils/production/resources";
import { getHarvestingBatches } from "@/lib/cultivation/harvest/batches";
import { populateProductIngredients } from "@/lib/production/product/ingredients";
import { ProductionManager } from "@/models/user/managers/ProductionManager";
import { createFacility } from "./facility";
import { createProductStock } from "@/lib/production/stocks";
import { createWarehouseStockSeed, seedWarehouse } from "../storage/warehouse";
import { Warehouse } from "@/models/sectors/storage/Warehouse";

export const createProducts = async () => {
  await Product.deleteMany({}); // Clear existing products
  await Warehouse.deleteMany({});
  console.log("Creating products...");
  const productionFacility = await createFacility();
  const productionManager = await ProductionManager.findOne();
  
  for (const productData of productsData) {
    const warehouse = await seedWarehouse();
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
    const warehouseStock = await createWarehouseStockSeed({
      product,
      productionStock,
      warehouseId: warehouse._id,
    });
    console.log(
      `Created product stock for ${product.name} with quantity ${productionStock.quantity} and warehouse stock with quantity ${warehouseStock.quantity}`,
    );
    productionManager.products.push(product._id);
    await productionManager.save();
    await product.save();
    console.log(`Seeded product: ${product.name}`);
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
    quantity: 2,
  });
  if (!batchWithResources) {
    return;
  }
  const productionStock = await createProductStock({
    productId: product._id,
    harvestingBatchId: batchWithResources._id,
    quantity: 2,
    productionFacilityId,
  });
  return productionStock;
};
