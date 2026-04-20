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
