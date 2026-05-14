import { WarehouseRequest } from "@/models/documents/requests/WarehouseRequest";

export const createWarehouseRequest = async (requestData) => {
  console.log(requestData);
  const { ...modelData } = requestData;
  const warehouseRequest = new WarehouseRequest({
    ...modelData,
    financialManager: requestData.financialManagerId,
    warehouseManager: requestData.warehouseManagerId,
    items: requestData.items,
    orderNumber: requestData.orderNumber,
  });
  await warehouseRequest.save();
};

export const getWarehouseRequests = async () => {
  const requests = await WarehouseRequest.find();
  return requests;
};
