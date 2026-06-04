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
