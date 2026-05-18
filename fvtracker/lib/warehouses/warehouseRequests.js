import { WarehouseRequest } from "@/models/documents/requests/WarehouseRequest";
import { populateIngredientsConfig } from "../production/product/ingredients";
import { Warehouse } from "@/models/sectors/storage/Warehouse";
import { Shipment } from "@/models/sectors/sales/Shipment";

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
        path: "items.product",
        populate: populateIngredientsConfig,
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
  warehouseManagerId,
  financialManagerId,
}) => {
  const shipment = new Shipment({
    warehouseRequest: warehouseRequestId,
    warehouseManager: warehouseManagerId,
    financialManager: financialManagerId,
  });

  const warehouseRequest = await getWarehouseRequestById(warehouseRequestId);
  warehouseRequest.populate([
    {
      path: "order",
    },
    {},
  ]);
  warehouseRequest.shipments.push(shipment._id);

  for (const source of shipmentSources) {
    const { warehouseId, productName, quantity } = source;
    const warehouse = await Warehouse.findById(warehouseId);
    await warehouse.populate({
      path: "stocks",
      populate: {
        path: "product",
      },
    });
    const stock = warehouse.stocks.find(
      (whs) => whs.product.name == s.productName,
    );
    if (!stock) {
      console.error(
        `Nema zaliha proizvoda ${productName} u skladištu ${warehouse.name}`,
      );
      continue;
    }
    const product = warehouse.stocks.find(
      (s) => s.product.name === productName,
    )?.product;
    if (!product) {
      console.error(
        `Nema zaliha proizvoda ${productName} u skladištu ${warehouse.name}`,
      );
      continue;
    }

    const shipmentItem = new ShipmentItem({
      product: product._id,
      quantity,
      shipment: shipment._id,
      warehouseStock: stock._id,
    });

    shipment.shipmentItems.push(shipmentItem._id);
    product.shipmentItems.push(shipmentItem._id);

    stock.quantity -= quantity;
    if (stock.quantity < 0) {
      console.error(
        `Nema dovoljno zaliha proizvoda ${productName} u skladištu ${warehouse.name}`,
      );
      continue;
    }
    stock.shipmentItems.push(shipmentItem._id);

    await stock.save();
    await product.save();
    await shipment.save();
    await warehouseRequest.save();
    await shipmentItem.save();
  }
};
