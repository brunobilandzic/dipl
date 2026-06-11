export const shipmentItemsProductSum = (shipmentItems) => {
  return shipmentItems.reduce((sum, item) => {
    const quantity = item.sources.reduce((itemSum, source) => {
      return itemSum + source.quantity;
    }, 0);
    return sum + quantity;
  }, 0);
};

export const shipmentItemsShipmentItemsProductQuantity = (shipmentItems) => {
  const products = {};
  shipmentItems.forEach((item) => {
    item.sources.forEach((source) => {
      const productId = source.product._id;
      if (!products[productId]) {
        products[productId] = {
          name: source.product.name,
          quantity: 0,
        };
      }
      products[productId].quantity += source.quantity;
    });
  });
  return Object.values(products);
};
