import { getRandomString } from "@/lib/utils/strings";
import { createWarehouse } from "@/lib/warehouses";
import {
  Warehouse,
  WarehouseAcceptanceProcess,
} from "@/models/sectors/storage/Warehouse";
import { WarehouseManager } from "@/models/user/managers/WarehouseManager";
import { acceptWarehouseStock } from "@/lib/warehouses/accept";
import { ProductionWorker } from "@/models/user/workers/ProductionWork";
import { getEmployedWorker } from "@/lib/workers/get";

export const seedWarehouse = async () => {
  const warehouseManager = await WarehouseManager.findOne();
  if (!warehouseManager) {
    throw new Error(
      "No warehouse manager found. Please create one before seeding the warehouse.",
    );
  }
  const warehouseData = {
    name: `Skladište ${getRandomString({ beginning: "WH", length: 3 })}`,
    description: "Skladište za pohranu proizvoda",
    warehouseManager: warehouseManager._id,
    volume: 10000,
  };
  const warehouse = await createWarehouse({ warehouseData, warehouseManager });
  warehouseManager.warehouses.push(warehouse._id);
  await warehouseManager.save();
  return warehouse;
};

export const seedWarehouses = async (count = 5) => {
  const warehouses = [];
  await Warehouse.deleteMany({});
  console.log(`Seeding ${count} warehouses...`);
  for (let i = 0; i < count; i++) {
    const warehouse = await seedWarehouse();
    warehouses.push(warehouse);
  }

  return warehouses;
};

export const createWarehouseStockSeed = async ({
  product,
  productionStock,
  warehouseId,
}) => {
  const productionWorker = await getEmployedWorker("ProductionWorker");
  const { warehouseStock } = await acceptWarehouseStock({
    product,
    quantity: 3,
    productionStock,
    warehouseId,
    workerId: productionWorker._id,
    comment: "Initial stock from seeding",
  });
  return warehouseStock;
};
