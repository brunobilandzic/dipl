import { ProductionStock } from "@/models/sectors/production/Facility";

export const acceptWarehouseStock = async ({
  productId,
  quantity,
  productionFacilityId,
  warehouseId,
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
  let stock = await WarehouseStock.findOne({
    product: productId,
    warehouse: warehouseId,
  });
  if (!stock) {
    stock = new WarehouseStock({
      product: productId,
      warehouse: warehouseId,
      quantity: 0,
    });
  }
  stock.quantity += quantity
  await stock.save();
};
