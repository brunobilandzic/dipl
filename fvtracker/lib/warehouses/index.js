import { Warehouse } from "@/models/sectors/storage/Warehouse";

export const createWarehouse = async ({ warehouseData }) => {
  const warehouse = new Warehouse(warehouseData);
  await warehouse.save();
  return warehouse;
};

export const updateWarehouse = async ({ id, data }) => {
  const warehouse = await getWarehouse({ id });
  Object.assign(warehouse, data);
  await warehouse.save();
  return warehouse;
};

export const deleteWarehouse = async ({ id }) => {
  await Warehouse.findByIdAndDelete(id);
};
