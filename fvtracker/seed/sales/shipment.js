import { WarehouseRequest } from "@/models/documents/requests/WarehouseRequest";
import { Shipment } from "@/models/sectors/sales";

export const createShipments = async ({}) => {
  await Shipment.deleteMany({});
  const warehouseRequests = await WarehouseRequest.find({}).select("_id");
  for (const request of warehouseRequests) {
    const shipment = new Shipment({
      warehouseRequest: request._id,
    });
    await shipment.save();
  }
};
