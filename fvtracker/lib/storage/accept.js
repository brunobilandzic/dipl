import { ProductionStock } from "@/models/sectors/production/Facility";
import { WarehouseStock } from "@/models/sectors/storage/Warehouse";

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
  productionStock.quantity -= quantity;

  let warehouseStock = await WarehouseStock.findOne({
    product: productId,
    warehouse: warehouseId,
  });
  if (!warehouseStock) {
    warehouseStock = new WarehouseStock({
      product: productId,
      warehouse: warehouseId,
      quantity: 0,
    });
  }
  warehouseStock.quantity += quantity;

  await productionStock.save();
  await warehouseStock.save();
};
