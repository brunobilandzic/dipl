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

export const getProductStocks = async () => {
  console.log("Fetching product stock...");
  return 2;
};
