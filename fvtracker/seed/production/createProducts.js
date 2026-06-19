import { productsData } from "../data/production/products";
import { Product } from "@/models/sectors/production/Product";
import { getBatchesWithResources } from "@/lib/utils/production/resources";
import { getHarvestingBatches } from "@/lib/cultivation/harvest/batches";
import { populateProductIngredients } from "@/lib/production/product/ingredients";
import { ProductionManager } from "@/models/user/managers/ProductionManager";
import { createFacility } from "./facility";
import { createProductStock } from "@/lib/production/stocks";
import { createWarehouseStockSeed, seedWarehouses } from "../storage/warehouse";
import {
  Warehouse,
  WarehouseAcceptanceProcess,
} from "@/models/sectors/storage/Warehouse";
import { ProductionWorker } from "@/models/user/workers/ProductionWork";
import { ProductionStock } from "@/models/sectors/production/Facility";
import { ProductionProcess } from "@/models/sectors/production/Process";
import { getEmployedWorker } from "@/lib/workers/get";

export const createProducts = async () => {
  await Product.deleteMany({}); // Clear existing products
  await Warehouse.deleteMany({});
  await ProductionStock.deleteMany({});
  await ProductionProcess.deleteMany({});
  await WarehouseAcceptanceProcess.deleteMany({});
  await ProductionWorker.updateMany(
    {},
    { $set: { productionProcesses: [], warehouseAcceptanceProcesses: [] } },
  );
  console.log("Creating products...");
  const productionFacility = await createFacility();
  const productionManager = await ProductionManager.findOne();
  const warehouses = await seedWarehouses(3);
  let stopIteration = false;
  const products = [];
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
    products.push(product);
    productionManager.products.push(product._id);
  }
  for (const warehouse of warehouses) {
    for (const product of products) {
      const { productionStock, productionProcess, stop } =
        await createProductStockSeed({
          product,
          productionFacilityId: productionFacility._id,
        });
      if (stop) {
        stopIteration = true;
        continue;
      }
      const warehouseStock = await createWarehouseStockSeed({
        product,
        productionStock,
        warehouseId: warehouse._id,
      });

      await productionManager.save();
      await product.save();
    }
  }

  if (stopIteration) {
    console.warn(
      "Neki proizvodi nisu mogli biti proizvedeni zbog nedostatka resursa. Molimo provjerite logove za detalje.",
    );
  }
};

export const createProductStockSeed = async ({
  product,
  productionFacilityId,
}) => {
  await populateProductIngredients({ products: [product] });
  const harvestingBatches = await getHarvestingBatches();
  const STOCK_QUANTITY = 5;
  const [batchWithResources] = getBatchesWithResources({
    harvestingBatches,
    product,
    quantity: STOCK_QUANTITY,
  });
  if (!batchWithResources) {
    return { productionStock: null, stop: false };
  }
  const productionWorker = await getEmployedWorker("ProductionWorker");
  const { productionStock, productionProcess, stop } = await createProductStock(
    {
      productId: product._id,
      harvestingBatchId: batchWithResources._id,
      quantity: STOCK_QUANTITY,
      productionFacilityId,
      workerId: productionWorker._id,
      comment: "Initial stock from seed script",
    },
  );
  return { productionStock, productionProcess, stop };
};
