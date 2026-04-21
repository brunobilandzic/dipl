import { getRandomString } from "@/lib/utils/strings";
import { createWarehouse } from "@/lib/warehouse";
import { Warehouse } from "@/models/sectors/storage/Warehouse";
import { WarehouseManager } from "@/models/user/managers/WarehouseManager";

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
