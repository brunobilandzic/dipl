import {
  WarehouseAcceptanceProcess,
  WarehouseStock,
} from "@/models/sectors/storage/Warehouse";
import { getWarehouse } from "./get";

export const acceptWarehouseStock = async ({
  product,
  quantity,
  productionFacilityId,
  warehouseId,
  comment,
  productionStock,
  workerId,
  facility = false,
}) => {
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
  productionStock.quantity -= Number(quantity);

  let warehouseStock = await WarehouseStock.findOne({
    product: product._id,
    warehouse: warehouseId,
  });

  if (!warehouseStock) {
    const warehouse = await getWarehouse({ id: warehouseId });
    warehouseStock = new WarehouseStock({
      product: product._id,
      warehouse: warehouseId,
      quantity: 0,
    });
    warehouse.stocks.push(warehouseStock._id);
    product.warehouseStocks.push(warehouseStock._id);

    await product.save();
    await warehouse.save();
  }
  warehouseStock.quantity += Number(quantity);
  const warehouseAcceptanceProcess = new WarehouseAcceptanceProcess({
    warehouseStock: warehouseStock._id,
    productionStock: productionStock._id,
    quantity: Number(quantity),
    comment,
    worker: workerId,
  });

  productionStock.warehouseAcceptanceProcesses.push(
    warehouseAcceptanceProcess._id,
  );
  warehouseStock.warehouseAcceptanceProcesses.push(
    warehouseAcceptanceProcess._id,
  );

  await product.save();
  await productionStock.save();

  await warehouseStock.save();
  await warehouseAcceptanceProcess.save();

  await warehouseAcceptanceProcess.populate({
    path: "warehouseStock",
    select: "product",
    populate: {
      path: "product",
      select: "name",
    },
  });
  if (!facility) {
    await warehouseStock.populate({
      path: "product",
      select: "warehouseStocks productionStocks",
      populate: "warehouseStocks productionStocks",
    });
  }
  return {
    warehouseStock,
    warehouseAcceptanceProcess: {
      _id: warehouseAcceptanceProcess._id,
      quantity: warehouseAcceptanceProcess.quantity,
      comment: warehouseAcceptanceProcess.comment,
      acceptedAt: warehouseAcceptanceProcess.acceptedAt,
      warehouseStock: warehouseAcceptanceProcess.warehouseStock, 
    },
  };
};
