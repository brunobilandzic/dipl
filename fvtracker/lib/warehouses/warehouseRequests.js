import { WarehouseRequest } from "@/models/documents/requests/WarehouseRequest";
import { populateIngredientsConfig } from "../production/product/ingredients";

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
}) => {
  const warehouseRequest = await getWarehouseRequestById(warehouseRequestId);
  warehouseRequest.populate([
    {
      path: "order",
    },
    {},
  ]);
  console.log({ shipmentSources });
  for (const source of shipmentSources) {
    const { warehouseId, productName, quantity } = source;
    const existingSource = warehouseRequest.sources.find(
      (s) =>
        s.warehouseId.toString() === warehouseId &&
        s.productName === productName,
    );
    if (existingSource) {
      existingSource.quantity += quantity;
      shipmentSources = shipmentSources.filter((s) => s !== source);
    } else {
    }
  }
  console.log({ shipmentSources, c: 1 });
};
