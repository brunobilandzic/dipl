import { getRandomString } from "@/lib/utils/strings";
import { WarehouseManager } from "@/models/user/managers/WarehouseManager";

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
  };
  const warehouse = await createWarehouse({ warehouseData });
  console.log(
    `Created warehouse: ${warehouse.name} with manager ${warehouseManager.name}`,
  );
  return warehouse;
};
