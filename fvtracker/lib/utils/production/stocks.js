export const productsAllProductionStocksSum = ({ productionStocks }) => {
  return productionStocks.reduce((acc, stock) => {
    acc += stock.quantity;
    return acc;
  }, 0);
};
