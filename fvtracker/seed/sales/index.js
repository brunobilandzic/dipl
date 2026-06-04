import { Order } from "@/models/sectors/sales";
import { createOrders } from "./orders";
import { createWarehouseRequests } from "./warehouseRequests";
import { WarehouseRequest } from "@/models/documents/requests/WarehouseRequest";
import { Customer } from "@/models/user/Customer";

export default {
  seedSales: async () => {
    await deleteDB();
    const orders = await createOrders();
    console.log("seeding orders completed");
    // create req for only one order
    const warehouseRequests = await createWarehouseRequests({
      orders: orders.slice(0, orders.length - 1),
    });
    console.log(`seeded ${warehouseRequests.length} warehouse requests`);
  },
};

const deleteDB = async () => {
  await Promise.all([
    Order.deleteMany({}),
    WarehouseRequest.deleteMany({}),
    Customer.deleteMany({}),
  ]);
};
