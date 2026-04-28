import { Warehouse } from "@/models/sectors/storage/Warehouse";
import warehousePopulateConfig from "./populateConfig";

export async function getWarehouse({ warehouseId }) {
  const warehouse = await Warehouse.findById(warehouseId).populate(
    warehousePopulateConfig,
  );
  return warehouse;
}

export async function getWarehouses() {
  const warehouses = await Warehouse.find().populate(warehousePopulateConfig);
  return warehouses;
}
