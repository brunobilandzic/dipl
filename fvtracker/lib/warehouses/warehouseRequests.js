import { WarehouseRequest } from "@/models/documents/requests/WarehouseRequest";
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
import {
  SHIPMENT_SHIPPED_FULLY,
  SHIPMENT_SHIPPED_PARTLY,
} from "../constants/warehouse/shipment";
import { Order } from "@/models/sectors/sales";

export const getWarehouseRequestById = async (id) => {
  const request = await WarehouseRequest.findById(id);
  if (!request) throw new Error("Zahtev nije pronađen");
  return request;
};

export const createWarehouseRequest = async (requestData) => {
  const { ...modelData } = requestData;
  const { warehouseId } = requestData;
  const warehouse = await mongoose.models("Warehouse").findById(warehouseId);
  if (!warehouse) {
    throw new Error("Skladište nije pronađeno");
  }
  const warehouseRequest = new WarehouseRequest({
    ...modelData,
    financialManager: requestData.financialManager,
    warehouseManager: warehouse.warehouseManager,
    order: requestData.orderId,
    financialWorker: requestData.workerId,
  });

  await warehouseRequest.save();
};

export const getWarehouseRequests = async ({
  financialManagerId,
  warehouseManagerId,
}) => {
  let filter = {};
  if (!financialManagerId && !warehouseManagerId) {
    filter = {};
  } else if (financialManagerId || warehouseManagerId) {
    filter = {
      $or: [
        { financialManager: financialManagerId },
        { warehouseManager: warehouseManagerId },
      ],
    };
  }
  const requests = await WarehouseRequest.find(filter).populate(
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
  workerId,
}) => {
  const warehouseRequest = await getWarehouseRequestById(warehouseRequestId);
  await warehouseRequest.populate(warehouseRequestPopulateShipmentItems);
  const shipment = await Shipment.findById(warehouseRequest.shipment).populate({
    path: "shipmentItems",
    populate: {
      path: "sources",
      populate: {
        path: "product",
      },
    },
  });
  const order = await Order.findById(warehouseRequest.order).populate([
    {
      path: "items",
      populate: [
        {
          path: "shipmentSources",
          populate: {
            path: "product",
          },
        },
        {
          path: "product",
        },
      ],
    },
  ]);

  const shipmentItem = new ShipmentItem({
    shipment: shipment._id,
    worker: workerId,
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
    }

    const product = stock.product;
    const orderItem = order.items.find((oi) => oi.product.name === productName);

    const shipmentSource = new ShipmentSource({
      product: product._id,
      quantity,
      warehouseStock: stock._id,
      orderItem: orderItem._id,
      shipmentItem: shipmentItem._id,
    });

    orderItem.shipmentSources.push(shipmentSource._id);
    shipmentItem.sources.push(shipmentSource._id);
    product.shipmentSources.push(shipmentSource._id);
    newShipmentSources.push(shipmentSource);

    stock.quantity -= quantity;
    if (stock.quantity < 0) {
      throw new Error(
        `Nema dovoljno zaliha proizvoda ${productName} u skladištu ${warehouse.name}`,
      );
    }
    stock.shipmentSources.push(shipmentItem._id);

    await orderItem.save();
    await stock.save();
    await shipmentSource.save();
    await product.save();
  }

  await shipmentItem.save();
  await shipment.save();
  const siPopulate = [
    {
      path: "sources",
      populate: {
        path: "product",
      },
    },
  ];
  await shipmentItem.populate(siPopulate);

  // get fresh shipment with populated sources to check if it's fully SHIPMENT_SHIPPED_FULLY
  const populatedShipment = await Shipment.findById(shipment._id).populate({
    path: "shipmentItems",
    populate: siPopulate,
  });

  if (
    calculateIsShipmentShipped({
      shipmentItems: [...populatedShipment.shipmentItems],
      orderItems: order.items,
    })
  ) {
    shipment.status = SHIPMENT_SHIPPED_FULLY;
  } else if (newShipmentSources.length > 0) {
    shipment.status = SHIPMENT_SHIPPED_PARTLY;
  }

  await shipmentItem.save();
  await warehouseRequest.order.save();
  await warehouseRequest.save();
  await shipment.save();

  return {
    shipmentItem,
  };
};
