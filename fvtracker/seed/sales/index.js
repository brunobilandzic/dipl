import { createOrders } from "./orders";
import { createWarehouseRequests } from "./warehouseRequests";

export default {
  seedSales: async () => {
    await createWarehouseRequests({ orders: await createOrders() });
  },
};
