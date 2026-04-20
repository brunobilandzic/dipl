import {
  ProductionStock,
  ProductStock,
  WarehouseStock,
} from "@/models/sectors/production/Product";
import { getProductById } from "../product";

export const createProductStock = async ({
  productId,
  quantity,
  harvestingBatchId,
}) => {
  // Implement the logic to create a product stock entry
  const product = await getProductById(productId);
  const stock = await product.createStock({ harvestingBatchId, quantity });
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
