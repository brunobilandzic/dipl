import { warehouseRequestPopulateShipmentItems } from "@/lib/utils/storage/warehouse";
import { fillWarehouseRequest } from "@/lib/warehouses/warehouseRequests";
import { getEmployedWorker } from "@/lib/workers/get";
import { Warehouse } from "@/models/sectors/storage/Warehouse";
import { WarehouseWorker } from "@/models/user/workers/WarehouseWork";

export const createShipments = async ({ warehouseRequests }) => {
  const warehouseWorker = await getEmployedWorker("WarehouseWorker");
  for (const warehouseRequest of warehouseRequests) {
    await warehouseRequest.populate(warehouseRequestPopulateShipmentItems);
    const orderItems = warehouseRequest.order.items;
    const sources = await buildShipmentSources({
      orderItems,
      warehouseManagerId: warehouseRequest.warehouseManager,
    });
    if (sources.length === 0) {
      continue;
    }
    await fillWarehouseRequest({
      warehouseRequestId: warehouseRequest._id,
      shipmentSources: sources,
      workerId: warehouseWorker._id,
    });
  }
};

const buildShipmentSources = async ({ orderItems, warehouseManagerId }) => {
  const sources = [];

  for (const oi of orderItems) {
    if (Math.random() < 0.5) {
      continue;
    }
    const shipmentSource = {
      productName: oi.product.name,
      quantity: oi.quantity,
    };
    const warehouseId = await findWarehouseForSource({
      shipmentSource,
      warehouseManagerId,
    });

    if (!warehouseId) {
      continue;
    }

    sources.push({
      productName: oi.product.name,
      quantity: oi.quantity,
      warehouseId,
    });
  }

  return sources;
};

const findWarehouseForSource = async ({
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
    });
    return null;
  }

  return stocksWithQuantity[0].warehouse;
};
