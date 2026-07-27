import { Shipment } from "@/models/sectors/sales/Shipment";
import shipmentPopulateConfig from "./shipmentPopulateConfig";

export const getShipmentById = async ({
  id,
  populateConfig = shipmentPopulateConfig,
}) => {
  const shipment = await Shipment.findById(id).populate(populateConfig);

  if (!shipment) {
    throw new Error("Shipment not found");
  }

  return shipment;
};

export const getShipments = async ({
  filter = {},
  populateConfig = shipmentPopulateConfig,
}) => {
  const shipments = await Shipment.find(filter).populate(populateConfig);
  if (!shipments) {
    throw new Error("Shipments not found");
  }
  return shipments;
};
