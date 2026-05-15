import { WarehouseRequest } from "@/models/documents/requests/WarehouseRequest";
import { FinancialManager } from "@/models/user/managers/FinancialManager";
import { WarehouseManager } from "@/models/user/managers/WarehouseManager";

export const createWarehouseRequests = async ({ orders }) => {
  const financialManager = await FinancialManager.findOne({}).select("_id");
  const warehouseManager = await WarehouseManager.findOne({}).select("_id");
  const createdWarehouseRequests = [];
  for (const order of orders) {
    const warehouseRequest = new WarehouseRequest({
      order: order._id,
      financialManager: financialManager._id,
      warehouseManager: warehouseManager._id,
    });
    await warehouseRequest.save();
    createdWarehouseRequests.push(warehouseRequest);
  }
  return createdWarehouseRequests;
};
