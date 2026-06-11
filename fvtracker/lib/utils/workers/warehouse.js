export const shipmentItemsProductSum = (shipmentItems) => {
  return shipmentItems.reduce((sum, item) => {
    const quantity = item.sources.reduce((itemSum, source) => {
      return itemSum + source.quantity;
    }, 0);
    return sum + quantity;
  }, 0);
};
