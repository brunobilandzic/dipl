export const receiptsData = ({ warehouseRequests }) => {
  console.log(
    "Processing warehouse requests for receipts data:",
    warehouseRequests,
  );
  const shipmentItems = warehouseRequests.flatMap(
    (request) => request.shipment.shipmentItems,
  );
  console.log("Extracted shipment items:", shipmentItems);
  const shipmentItemsWithReceipts = shipmentItems.filter(
    (item) => item.receipt,
  );

  console.log(
    "Filtered shipment items with receipts:",
    shipmentItemsWithReceipts,
  );

  const sources = shipmentItemsWithReceipts.flatMap((item) => item.sources);
  console.log("Extracted sources from shipment items with receipts:", sources);

  const totalPrice = sources.reduce((sum, source) => {
    const sourceTotal = source.quantity * source.product.price;
    console.log(
      `Calculating total for source: ${source.product.name}, quantity: ${source.quantity}, price: ${source.product.price}, sourceTotal: ${sourceTotal}`,
    );
    return sum + sourceTotal;
  }, 0);

  console.log("Total price calculated from sources:", totalPrice);
  return {
    totalPrice,
    totalItems: sources.reduce((sum, source) => sum + source.quantity, 0),
  };
};
