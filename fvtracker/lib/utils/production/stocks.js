import api from "@/lib/api";
import { PRODUCTION_STOCK } from "@/lib/constants/production";

export const productsAllProductionStocksSum = ({ productionStocks }) => {
  return productionStocks.reduce((acc, stock) => {
    acc += stock.quantity;
    return acc;
  }, 0);
};

export const productionStoksFacilities = ({ productionStocks }) => {
  return productionStocks.reduce((acc, stock) => {
    const facilityName = stock.facility.name;
    if (!acc[facilityName]) {
      acc[facilityName] = 0;
    }
    acc[facilityName] += stock.quantity;
    return acc;
  }, {});
};

export const submitProductionStock = async ({ productionStock }) => {
  const res = await api.post(
    "/stocks",
    {
      productionStockData: productionStock,
    },
    {
      params: {
        stockType: PRODUCTION_STOCK,
      },
    },
  );
  return res.data;
};
