import { Warehouse } from "@/models/sectors/storage/Warehouse";
import warehousePopulateConfig from "./populateConfig";

export async function getWarehouse({ warehouseId }) {
  const warehouse = await Warehouse.findById(warehouseId).populate(warehousePopulateConfig);
  return warehouse;
}
