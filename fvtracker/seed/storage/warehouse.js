import { getRandomString } from "@/lib/utils/strings";
import { createWarehouse } from "@/lib/warehouses";
import { Warehouse } from "@/models/sectors/storage/Warehouse";
import { WarehouseManager } from "@/models/user/managers/WarehouseManager";
import { acceptWarehouseStock } from "@/lib/warehouses/accept";

export const seedWarehouse = async () => {
  await Warehouse.deleteMany({});
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
  };
  const warehouse = await createWarehouse({ warehouseData });
  console.log(
    `Seeded warehouse: ${warehouse.name} with manager ${warehouseManager.name}`,
  );
  return warehouse;
};

export const createWarehouseStockSeed = async ({
  product,
  productionStock,
}) => {
  const warehouse = await seedWarehouse();
  await acceptWarehouseStock({
    product,
    quantity: 1,
    productionStock,
    warehouseId: warehouse._id,
    comment: "Initial stock from seeding",
  });
};
