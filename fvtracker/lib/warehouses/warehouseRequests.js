import { WarehouseRequest } from "@/models/documents/requests/WarehouseRequest";

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
