import {
  ProductionStock,
  ProductStock,
  WarehouseStock,
} from "@/models/sectors/production/Product";
import { getProductById } from "../product";
import { getHarvestingBatches } from "@/lib/cultivation/harvest/batches";
import { populateProductIngredients } from "@/lib/production/product/ingredients";
import { ProductionProcess } from "@/models/sectors/production/Process";

export const createProductStock = async ({
  productId,
  productionFacilityId,
  harvestingBatchId,
  quantity,
  comment,
}) => {
  const product = await getProductById(productId);
  const deductResources = async () => {
    // to create product, we have tto use harvesterd
    // find harvesting batch for create product
    const [harvestingBatch] = await getHarvestingBatches({
      batchIds: [harvestingBatchId],
    });
    if (!harvestingBatch) {
      throw new Error(
        `Harvesting batch with id ${harvestingBatchId} not found.`,
      );
    }
    await populateProductIngredients({
      products: [product],
    });
    for (const ingredient of product.ingredients) {
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
    return harvestingBatch;
  };
  const harvestingBatch = await deductResources();

  let stock = await ProductionStock.findOne({
    product: product._id,
    facility: productionFacilityId,
  });

  if (!stock) {
    stock = new ProductionStock({
      product: product._id,
      quantity,
      facility: productionFacilityId,
    });
  } else {
    stock.quantity += quantity;
  }

  const productionProcess = new ProductionProcess({
    productionsStock: stock._id,
    quantity,
    comment,
  });
  stock.processes.push(productionProcess._id);
  harvestingBatch.productionProcesses.push(productionProcess._id);
  await harvestingBatch.save();
  await productionProcess.save();
  await stock.save();

  return stock;
};

export const getStocks = async () => {
  console.log("Fetching products stocks...");

  const productionStocks = await ProductionStock.find().populate([
    {
      path: "product",
      select: "name ingredients description slug",
      populate: [
        {
          path: "ingredients",
          select: "cropVariety quantity",
          populate: [
            {
              path: "cropVariety",
              select: "name cropType",
              populate: [
                {
                  path: "cropType",
                  select: "name",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "productionProcesses",
      select: "name description ",
    },
    {
      path: "facility",
      select: "name description ",
    },
  ]);
  if (!productionStocks) {
    throw new Error("No product stocks found.");
  }

  const warehousedStocks = await WarehouseStock.find().populate([
    {
      path: "product",
    },
    {
      path: "warehouse",
    },
  ]);

  return { productionStocks, warehousedStocks };
};
