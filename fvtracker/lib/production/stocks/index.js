import { ProductStock } from "@/models/sectors/production/Product";
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
  const stocks = await ProductStock.findAll().populate([
    {
      path: "product",
      select: "name ingredients description",
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
      select: "name description",
    },
  ]);
  if (!stocks) {
    throw new Error("No product stocks found.");
  }
  return stocks;
};
