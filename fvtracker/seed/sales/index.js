import { Order, Receipt } from "@/models/sectors/sales";
import { createOrders } from "./orders";
import { createWarehouseRequests } from "./warehouseRequests";
import { WarehouseRequest } from "@/models/documents/requests/WarehouseRequest";
import { Customer } from "@/models/user/Customer";
import { arrayRandomSlice } from "@/lib/utils/objects";

export default {
  seedSales: async () => {
    await deleteDB();
    console.log("seeding orders...");
    const orders = await createOrders();
    console.log("seeding orders completed");
    // create req for only one order
    const warehouseRequests = await createWarehouseRequests({
      orders: arrayRandomSlice(orders, 5),
    });
    console.log(`seeded ${warehouseRequests.length} warehouse requests`);
  },
};

const deleteDB = async () => {
  console.log(
    "Clearing existing orders, warehouse requests, customers, and receipts...",
  );
  await Promise.all([
    Order.deleteMany({}),
    WarehouseRequest.deleteMany({}),
    Customer.deleteMany({}),
    Receipt.deleteMany({}),
  ]);
};
