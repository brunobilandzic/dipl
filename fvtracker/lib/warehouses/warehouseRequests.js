import { WarehouseRequest } from "@/models/documents/requests/WarehouseRequest";
import { populateIngredientsConfig } from "../production/product/ingredients";
import { Warehouse } from "@/models/sectors/storage/Warehouse";
import { Shipment, ShipmentItem } from "@/models/sectors/sales/Shipment";
import { getWarehouse } from "./get";

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
  const requests = await WarehouseRequest.find().populate([
    {
      path: "order",
      populate: {
        path: "items",
        populate: {
          path: "product",
        },
      },
    },
    {
      path: "shipment",
      populate: {
        path: "shipmentItems",
        populate: {
          path: "sources",
          populate: {
            path: "product",
            select: "name",
          },
        },
      },
    },
  ]);
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
  await warehouseRequest.populate([
    {
      path: "order",
      populate: {
        path: "items",
        populate: [
          {
            path: "product",
          },
          {
            path: "shipmentSources",
          },
        ],
      },
    },
    {
      path: "shipment",
    },
  ]);

  const shipmentItem = new ShipmentItem({
    shipment: warehouseRequest.shipment._id,
    order: warehouseRequest.order._id,
  });
  warehouseRequest.order.shipmentItems.push(shipmentItem._id);
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
      console.error(
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
      shipment: warehouseRequest.shipment._id,
      warehouseStock: stock._id,
      orderItem: orderItem._id,
      shipmentItem: shipmentItem._id, 
    });

    orderItem.shipmentItems.push(shipmentItem._id);
    warehouseRequest.shipment.shipmentItems.push(shipmentItem._id);
    newShipmentItems.push(shipmentItem);

    stock.quantity -= quantity;
    if (stock.quantity < 0) {
      console.error(
        `Nema dovoljno zaliha proizvoda ${productName} u skladištu ${warehouse.name}`,
      );
      continue;
    }
    stock.shipmentItems.push(shipmentItem._id);
    await orderItem.save();
    await stock.save();
    await shipmentItem.save();
  }

  await warehouseRequest.shipment.save();
  await warehouseRequest.save();

  return {
    message: "Zahtev je uspešno popunjen i poslat na isporuku.",
    shipment: warehouseRequest.shipment,
    warehouseRequest,
  };
};
