import api from "@/lib/api";
import { WAREHOUSE_STOCK } from "@/lib/constants/warehouse";

export const totalWarehouseStockQuantity = ({ warehouseStocks }) => {
  return warehouseStocks.reduce((acc, stock) => {
    acc += stock.quantity;
    return acc;
  }, 0);
};

export const submitWarehouseStock = async ({ warehouseStockData }) => {
  console.log({ warehouseStockData });
  const res = await api.post(
    "/stocks",
    {
      warehouseStockData,
    },
    {
      params: {
        stockType: WAREHOUSE_STOCK,
      },
    },
  );
  return res.data.newWarehouseStock;
};
