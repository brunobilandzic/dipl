export const buildAcceptances = ({ stocks }) => {
  const acceptances = [];
  stocks.forEach((stock) => {
    acceptances.push({
      product: stock.product.name,
      warehouseAcceptanceProcesses: stock.warehouseAcceptanceProcesses,
    });
  });
  return acceptances;
};
