import { ProductionStock } from "@/models/sectors/production/Facility";
import {
  WarehouseAcceptanceProcess,
  WarehouseStock,
} from "@/models/sectors/storage/Warehouse";

export const acceptWarehouseStock = async ({
  product,
  quantity,
  productionFacilityId,
  warehouseId,
  comment,
}) => {
  const productionStock = await ProductionStock.findOne({
    product: product._id,
    facility: productionFacilityId,
  });
  if (!productionStock) {
    throw new Error(
      `Production stock not found for product ${product._id} in facility ${productionFacilityId}`,
    );
  }
  if (productionStock.quantity < quantity) {
    throw new Error(
      `Not enough quantity in production stock. Required: ${quantity}, Available: ${productionStock.quantity}`,
    );
  }
  productionStock.quantity -= quantity;

  let warehouseStock = await WarehouseStock.findOne({
    product: product._id,
    warehouse: warehouseId,
  });
  if (!warehouseStock) {
    warehouseStock = new WarehouseStock({
      product: product._id,
      warehouse: warehouseId,
      quantity: 0,
    });
  }
  warehouseStock.quantity += quantity;

  const warehouseAcceptanceProcess = new WarehouseAcceptanceProcess({
    warehouseStock: warehouseStock._id,
    productionStock: productionStock._id,
    quantity,
    comment,
  });

  productionStock.warehouseAcceptanceProcesses.push(
    warehouseAcceptanceProcess._id,
  );
  warehouseStock["warehouseAcceptanceProcesses"] = [
    warehouseAcceptanceProcess._id,
  ];
  product.warehouseStocks.push(warehouseStock._id);

  await product.save();
  await productionStock.save();
  
  await warehouseStock.save();
  await warehouseAcceptanceProcess.save();
};
