import { Warehouse } from "@/models/sectors/storage/Warehouse";
import { getWarehouse } from "./get";

export const createWarehouse = async ({ warehouseData, warehouseManager }) => {
  const warehouse = new Warehouse(warehouseData);
  warehouse.warehouseManager = warehouseManager;

  warehouseManager.warehouses.push(warehouse._id);

  await warehouseManager.save();
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

export const deleteWarehouses = async ({ ids } = {}) => {
  if (!ids) await Warehouse.deleteMany({});
  else await Warehouse.deleteMany({ _id: { $in: ids } });
};
