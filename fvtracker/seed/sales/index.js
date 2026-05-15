import { createOrders } from "./orders";
import { createWarehouseRequests } from "./warehouseRequests";

export default {
  seedSales: async () => {
    const orders = await createOrders();
    // create req for only one order
    await createWarehouseRequests({ orders: [orders[0]] });
  },
};
