export const getshipmentSourcesCountProducts = (products) =>
  products?.reduce(
    (total, product) =>
      total +
      product.shipmentSources.reduce(
        (sourceTotal, source) => sourceTotal + source.quantity,
        0,
      ),
    0,
  );

export const getshipmentSourcesCount = (shipmentItems) =>
  shipmentItems?.reduce(
    (total, item) =>
      total +
      item.sources.reduce(
        (sourceTotal, source) => sourceTotal + source.quantity,
        0,
      ),
    0,
  );
