import { WarehouseRequest } from "../interface/Request";

export const createWarehouseRequest = async (requestData) => {
  const warehouseRequest = new WarehouseRequest({
    financialManager: requestData.financialManagerId,
    warehouseManager: requestData.warehouseManagerId,
    items: requestData.items,
  });
  await warehouseRequest.save();
};
