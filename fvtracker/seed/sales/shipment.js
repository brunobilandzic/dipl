import { warehouseRequestPopulateShipmentItems } from "@/lib/utils/storage/warehouse";
import { fillWarehouseRequest } from "@/lib/warehouses/warehouseRequests";
import { Warehouse } from "@/models/sectors/storage/Warehouse";

export const createShipments = async ({ warehouseRequests }) => {
  for (const warehouseRequest of warehouseRequests) {
    await warehouseRequest.populate(warehouseRequestPopulateShipmentItems);
    const orderItems = warehouseRequest.order.items;
    await fillWarehouseRequest({
      warehouseRequestId: warehouseRequest._id,
      shipmentSources: await buildShipmentSources({
        orderItems,
        warehouseManagerId: warehouseRequest.warehouseManager,
      }),
    });
  }
};

const buildShipmentSources = async ({ orderItems, warehouseManagerId }) => {
  const sources = [];

  for (const oi of orderItems) {
    if (Math.random() < 0.5) {
      console.log({ skipping: oi.product.name });
      continue;
    }
    const shipmentSource = {
      productName: oi.product.name,
      quantity: oi.quantity,
    };
    const warehouse = findWarehouseForShipmentSource({
      shipmentSource,
      warehouseManagerId,
    });

    console.log({ warehouse });

    sources.push({
      productName: oi.product.name,
      quantity: oi.quantity,
      warehouse,
    });
  }
  return sources;
};

const findWarehouseForShipmentSource = async ({
  shipmentSource,
  warehouseManagerId,
}) => {
  const warehouses = await Warehouse.find({
    warehouseManager: warehouseManagerId,
  }).populate({
    path: "stocks",
    populate: {
      path: "product",
    },
  });

  const stocks = warehouses.reduce((acc, warehouse) => {
    return [...acc, ...warehouse.stocks];
  }, []);

  const stocksWithQuantity = stocks.filter(
    (stock) =>
      stock.product.name === shipmentSource.productName &&
      shipmentSource.quantity <= stock.quantity,
  );

  if (stocksWithQuantity.length === 0) {
    console.log({
      error: `Nema dovoljno zaliha za proizvod ${shipmentSource.productName}`,
      shipmentSource,
      stocks: stocks.map((s) => ({
        product: s.product.name,
        quantity: s.quantity,
      })),
    });
    throw new Error(
      `Nema dovoljno zaliha za proizvod ${shipmentSource.productName}`,
    );
  }

  return stocksWithQuantity[0].warehouse;
};
