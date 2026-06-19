export const processesQuantitySum = ({ processes }) => {
  return processes.reduce((sum, process) => sum + process.quantity, 0);
};

export const processProductsMap = ({ processes, production = true }) => {
  const products = processes.flatMap((process) => ({
    name: production
      ? `${process.productionStock.product.name}`
      : `${process.warehouseStock.product.name}`,
    quantity: process.quantity,
  }));
  const productsMap = new Map();
  products.forEach((product) => {
    if (!productsMap.has(product.name)) {
      productsMap.set(product.name, 0);
    }
    productsMap.set(
      product.name,
      productsMap.get(product.name) + product.quantity,
    );
  });
  return Array.from(productsMap.entries()).map(([name, quantity]) => ({
    name,
    quantity,
  }));
};
