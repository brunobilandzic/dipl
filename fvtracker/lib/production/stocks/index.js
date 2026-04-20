import {
  ProductionStock,
  ProductStock,
  WarehouseStock,
} from "@/models/sectors/production/Product";
import { getProductById } from "../product";

export const createProductStock = async ({
  productId,
  productionFacilityId,
  harvestingBatchId,
  quantity,
}) => {
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
  // Implement the logic to create a product stock entry
  const product = await getProductById(productId);
  const stock = await product.createProductionStock({
    harvestingBatchId,
    quantity,
  });
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
