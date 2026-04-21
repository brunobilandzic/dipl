import { ProductionStock } from "@/models/sectors/production/Facility";

export const createWarehouseStock = async ({
  productId,
  quantity,
  productionFacilityId,
}) => {
  const productionStock = await ProductionStock.findOne({
    product: productId,
    facility: productionFacilityId,
  });
  if (!productionStock) {
    throw new Error(
      `Production stock not found for product ${productId} in facility ${productionFacilityId}`,
    );
  }
  if (productionStock.quantity < quantity) {
    throw new Error(
      `Not enough quantity in production stock. Required: ${quantity}, Available: ${productionStock.quantity}`,
    );
  }
};
