import { Warehouse } from "@/models/sectors/storage/Warehouse";

export const createWarehouse = async ({ warehouseData }) => {
  const warehouse = new Warehouse(warehouseData);
  await warehouse.save();
  return warehouse;
};


async function refreshWarehouses({ dispatch }) {
  try {
    const res = await api.get("/warehouses");
    