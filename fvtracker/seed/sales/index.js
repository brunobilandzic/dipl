import { Order } from "@/models/sectors/sales";
import { createOrders } from "./orders";
import { createWarehouseRequests } from "./warehouseRequests";
import { WarehouseRequest } from "@/models/documents/requests/WarehouseRequest";
import { Customer } from "@/models/user/Customer";

export default {
  seedSales: async () => {
    await deleteDB();
    const orders = await createOrders();
    // create req for only one order
    await createWarehouseRequests({ orders: [orders[0]] });
  },
};

const deleteDB = async () => {
  await Promise.all([
    Order.deleteMany({}),
    WarehouseRequest.deleteMany({}),
    Customer.deleteMany({}),
  ]);
};
