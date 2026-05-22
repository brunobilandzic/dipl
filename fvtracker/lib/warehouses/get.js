import { Warehouse } from "@/models/sectors/storage/Warehouse";
import warehousePopulateConfig from "./populateConfig";

export async function getWarehouse({ id }) {
  const warehouse = await Warehouse.findById(id).populate(
    warehousePopulateConfig,
  );
  if (!warehouse) {
    throw new Error("Warehouse not found with the provided ID.");
  }
  return warehouse;
}

export async function getWarehouses({ managerId }) {
  if (managerId) {
    const warehouses = await Warehouse.find({
      warehouseManager: managerId,
    }).populate(warehousePopulateConfig);
    if (!warehouses) {
      throw new Error("No warehouses found for the provided manager.");
    }
    return warehouses;
  }

  const warehouses = await Warehouse.find().populate(warehousePopulateConfig);
  if (!warehouses) {
    throw new Error("No warehouses found");
  }
  return warehouses;
}
