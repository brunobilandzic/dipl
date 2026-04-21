import { Warehouse } from "@/models/sectors/warehouse/Warehouse";

export const createWarehouse = async ({ warehouseData }) => {
  const warehouse = new Warehouse(warehouseData);
  await warehouse.save();
  return warehouse;
};
