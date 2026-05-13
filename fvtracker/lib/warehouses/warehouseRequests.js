import { WarehouseRequest } from "../../models/sectors/interface/Request";

export const createWarehouseRequest = async (requestData) => {
  const warehouseRequest = new WarehouseRequest({
    financialManager: requestData.financialManagerId,
    warehouseManager: requestData.warehouseManagerId,
    items: requestData.items,
  });
  await warehouseRequest.save();
};

export const getWarehouseRequests = async () => {
  const requests = await WarehouseRequest.find();

  return requests;
};
