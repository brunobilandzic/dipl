import { Warehouse } from "@/models/sectors/storage/Warehouse";

export async function getWarehouse({ warehouseId }) {
  const warehouse = await Warehouse.findById(warehouseId).populate([
    {
      path: "stocks",
    },
  ]);
  return warehouse;
}
