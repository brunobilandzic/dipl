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
  console.log("[deleteDB] 1 start");

  console.log("[deleteDB] 2 deleting orders");
  await Order.deleteMany({});

  console.log("[deleteDB] 3 deleting warehouse requests");
  await WarehouseRequest.deleteMany({});

  console.log("[deleteDB] 4 deleting customers");
  await Customer.deleteMany({});

  console.log("[deleteDB] 5 deleting receipts");
  await Receipt.deleteMany({});

  console.log("[deleteDB] 6 done");
};

const deleteDB_bup = async () => {
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
