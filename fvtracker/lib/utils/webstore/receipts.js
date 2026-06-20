export const receiptsData = ({ warehouseRequests }) => {
  const shipmentItems = warehouseRequests.flatMap(
    (request) => request.shipment.shipmentItems,
  );
  const shipmentItemsWithReceipts = shipmentItems.filter(
    (item) => item.receipt,
  );

  const sources = shipmentItemsWithReceipts.flatMap((item) => item.sources);
  const totalPrice = sources.reduce((sum, source) => {
    const sourceTotal = source.quantity * source.product.price;
    return sum + sourceTotal;
  }, 0);

  return {
    totalPrice,
    totalItems: sources.reduce((sum, source) => sum + source.quantity, 0),
    receiptCount: shipmentItemsWithReceipts.length,
  };
};
