import { WarehouseRequest } from "@/models/documents/requests/WarehouseRequest";
import { populateIngredientsConfig } from "../production/product/ingredients";
import { Warehouse } from "@/models/sectors/storage/Warehouse";
import {
  Shipment,
  ShipmentItem,
  ShipmentSource,
} from "@/models/sectors/sales/Shipment";
import { getWarehouse } from "./get";
import {
  calculateIsShipmentShipped,
  warehouseRequestPopulateShipmentItems,
} from "../utils/storage/warehouse";
import { SHIPMENT_SHIPPED } from "../constants/warehouse/shipment";
import { Order } from "@/models/sectors/sales";

export const getWarehouseRequestById = async (id) => {
  const request = await WarehouseRequest.findById(id);
  if (!request) throw new Error("Zahtev nije pronađen");
  return request;
};

export const createWarehouseRequest = async (requestData) => {
  console.log(requestData);
  const { ...modelData } = requestData;
  const warehouseRequest = new WarehouseRequest({
    ...modelData,
    financialManager: requestData.financialManagerId,
    warehouseManager: requestData.warehouseManagerId,
    order: requestData.orderId,
  });

  await warehouseRequest.save();
};

export const getWarehouseRequests = async () => {
  const requests = await WarehouseRequest.find().populate(
    warehouseRequestPopulateShipmentItems,
  );
  return requests;
};

export const shipWarehouseRequest = async ({ warehouseRequestId }) => {
  const request = await getWarehouseRequestById(warehouseRequestId);
};

export const fillWarehouseRequest = async ({
  warehouseRequestId,
  shipmentSources,
}) => {
  const warehouseRequest = await getWarehouseRequestById(warehouseRequestId);
  await warehouseRequest.populate(warehouseRequestPopulateShipmentItems);
  const shipment = await Shipment.findById(warehouseRequest.shipment);
  const order = await Order.findById(warehouseRequest.order).populate({
    path: "items",
    populate: {
      path: "shipmentSources",
      populate: {
        path: "product",
      }
    },
  });

  const oldSources = shipment.shipmentItems.reduce((acc, si) => {
    if (!si.sources) return acc;
    return [...acc, ...si.sources];
  }, []);

  console.log({
    shipmentSources,
    oldSources,
  });

  const shipmentItem = new ShipmentItem({
    shipment: shipment._id,
    order: warehouseRequest.order._id,
  });

  shipment.shipmentItems.push(shipmentItem._id);

  const newShipmentSources = [];

  for (const source of shipmentSources) {
    // the stuff we input in the form
    const { warehouseId, productName, quantity } = source;

    const warehouse = await getWarehouse({ id: warehouseId });
    await warehouse.populate({
      path: "stocks",
      populate: {
        path: "product",
      },
    });

    const stock = warehouse.stocks.find(
      (whs) => whs.product.name == source.productName,
    );
    if (!stock) {
      throw new Error(
        `Nema zaliha proizvoda ${productName} u skladištu ${warehouse.name}, ne postoji.`,
      );
      continue;
    }

    const product = stock.product;

    const orderItem = warehouseRequest.order.items.find(
      (oi) => oi.product.name === productName,
    );

    const shipmentSource = new ShipmentSource({
      product: product._id,
      quantity,
      warehouseStock: stock._id,
      orderItem: orderItem._id,
      shipmentItem: shipmentItem._id,
    });

    orderItem.shipmentSources.push(shipmentSource._id);
    shipmentItem.sources.push(shipmentSource._id);

    newShipmentSources.push(shipmentSource);

    stock.quantity -= quantity;
    if (stock.quantity < 0) {
      throw new Error(
        `Nema dovoljno zaliha proizvoda ${productName} u skladištu ${warehouse.name}`,
      );
      continue;
    }
    stock.shipmentSources.push(shipmentItem._id);

    await orderItem.save();
    await stock.save();
    await shipmentSource.save();
  }

  await shipmentItem.save();

  const siPopulate = [
    {
      path: "sources",
      populate: {
        path: "product",
      },
    },
  ];
  await shipmentItem.populate(siPopulate);
  await shipment.populate({
    path: "shipmentItems",
    populate: siPopulate,
  });

  if (
    calculateIsShipmentShipped({
      shipmentItems: [...shipment.shipmentItems, shipmentItem],
    })
  ) {
    console.log("Shipment is fully shipped", shipment.shipmentItems, "...");
    warehouseRequest.shipment.status = SHIPMENT_SHIPPED;
  }

  await shipmentItem.save();
  await warehouseRequest.shipment.save();
  await warehouseRequest.order.save();
  await warehouseRequest.save();

  return {
    message: "Zahtev je uspešno popunjen i poslat na isporuku.",
    shipment: warehouseRequest.shipment,
    warehouseRequest,
  };
};
