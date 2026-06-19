import {
  ProductionFacility,
  ProductionStock,
} from "@/models/sectors/production/Facility";
import { WarehouseStock } from "@/models/sectors/storage/Warehouse";
import { getProductById } from "../product";
import {
  findBatchByName,
  getHarvestingBatches,
} from "@/lib/cultivation/harvest/batches";
import { populateProductIngredients } from "@/lib/production/product/ingredients";
import { ProductionProcess } from "@/models/sectors/production/Process";
import { HarvestingBatchItem } from "@/models/sectors/interface/HarvestingBatch";
import { ProductionWorker } from "@/models/user/workers/ProductionWork";

export const createProductStock = async ({
  productId,
  productionFacilityId,
  batchName,
  harvestingBatchId,
  quantity,
  comment,
  workerId,
}) => {
  console.log("creating product stock");
  const product = await getProductById(productId);
  const deductResources = async () => {
    // to create product, we have tto use harvesterd
    // find harvesting batch for create product

    let harvestingBatch;

    if (batchName) {
      harvestingBatch = await findBatchByName({ name: batchName });
      await harvestingBatch.populate({
        path: "harvestingBatchItems",
        select: "cropVariety batchQuantity quality",
      });
    } else if (harvestingBatchId) {
      const res = await getHarvestingBatches({
        batchIds: [harvestingBatchId],
      });
      harvestingBatch = res[0];
    }

    if (!harvestingBatch) {
      throw new Error(
        `Harvesting batch with id ${harvestingBatchId} not found.`,
      );
    }

    await populateProductIngredients({
      products: [product],
    });

    for (const ingredient of product.ingredients) {
      const batchItem = harvestingBatch.harvestingBatchItems.find(
        (item) =>
          item.cropVariety.equals(ingredient.cropVariety._id) &&
          item.quality === ingredient.quality,
      );
      if (!batchItem) {
        throw new Error(
          `No matching harvesting batch item found for ingredient with crop variety ${ingredient.cropVariety.name}.`,
        );
      }
      if (batchItem.batchQuantity < ingredient.quantity * quantity) {
        console.error(
          `Not enough quantity in harvesting batch for ingredient with crop variety ${ingredient.cropVariety.name}. Required: ${ingredient.quantity * quantity}, Available: ${batchItem.batchQuantity}`,
        );
        return {
          stop: true,
          message: `Not enough quantity in harvesting batch for ingredient with crop variety ${ingredient.cropVariety.name}. Required: ${ingredient.quantity * quantity}, Available: ${batchItem.batchQuantity}`,
        };
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
  if (harvestingBatch.stop) {
    return { stop: true, message: harvestingBatch.message };
  }

  const facility = await ProductionFacility.findById(productionFacilityId);
  if (!facility) {
    throw new Error(
      `Production facility with id ${productionFacilityId} not found.`,
    );
  }
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
    facility.stocks.push(stock._id);
    product.productionStocks.push(stock._id);
    await product.save();
    await facility.save();
    await stock.save();
  } else {
    stock.quantity += Number(quantity);
  }

  const productionWorker = await ProductionWorker.findById(workerId);

  if (!productionWorker) {
    throw new Error(`Production worker with id ${workerId} not found.`);
  }

  const productionProcess = new ProductionProcess({
    productionsStock: stock._id,
    quantity,
    comment,
    worker: productionWorker._id,
    productionStock: stock._id,
  });
  await HarvestingBatchItem.updateMany(
    { harvestingBatch: harvestingBatch._id },
    { $push: { productionProcesses: productionProcess._id } },
  );
  await stock.populate({ path: "facility", select: "name" });
  stock.productionProcesses.push(productionProcess._id);

  await harvestingBatch.save();
  await productionProcess.save();
  await productionProcess.populate({
    path: "productionsStock",
    select: "product quantity",
    populate: {
      path: "product",
      select: "name",
    },
  });
  await stock.save();
  await stock.populate({
    path: "product",
    select: "warehouseStocks productionStocks",
    populate: [
      {
        path: "warehouseStocks",
      },
      {
        path: "productionStocks",
        select: "quantity facility",
        populate: {
          path: "facility",
          select: "name",
        },
      },
    ],
  });
  return { productionStock: stock, productionProcess, stop: false };
};

export const getStocks = async () => {
  const productionStocks = await ProductionStock.find().populate([
    {
      path: "product",
      select: "name ingredients description slug",
      populate: [
        {
          path: "ingredients",
          select: "cropVariety quantity quality",
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
