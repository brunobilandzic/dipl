import { WarehouseRequest } from "@/models/documents/requests/WarehouseRequest";
import { FinancialManager } from "@/models/user/managers/FinancialManager";
import { WarehouseManager } from "@/models/user/managers/WarehouseManager";
import { createShipments } from "./shipment";
import { WAREHOUSE_REQUESTED } from "@/lib/constants/webstore/orders";

export const createWarehouseRequests = async ({ orders }) => {
  const financialManager = await FinancialManager.findOne({}).select(
    "_id warehouseRequests ",
  );
  const warehouseManager = await WarehouseManager.findOne({}).select(
    "_id warehouseRequests ",
  );
  const createdWarehouseRequests = [];
  for (const order of orders) {
    const warehouseRequest = new WarehouseRequest({
      order: order._id,
      financialManager: financialManager._id,
      warehouseManager: warehouseManager._id,
    });

    financialManager.warehouseRequests.push(warehouseRequest._id);
    warehouseManager.warehouseRequests.push(warehouseRequest._id);

    await financialManager.save();
    await warehouseManager.save();

    order.warehouseRequest = warehouseRequest._id;
    order.state = WAREHOUSE_REQUESTED;
    await order.save();
    await warehouseRequest.save();
    createdWarehouseRequests.push(warehouseRequest);
  }

  await createShipments({ warehouseRequests: createdWarehouseRequests });
  console.log({ whrs: createdWarehouseRequests.length });
  return createdWarehouseRequests;
};
