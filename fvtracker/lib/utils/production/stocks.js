import api from "@/lib/api";

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
  const res = await api.post("/stocks", productionStock);
  return res.data.newProductionStock;
};
