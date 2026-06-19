import { fetchManager, fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import { FINANCIAL_MANAGER } from "@/lib/constants/users/managerTypes";
import { managerMorkerMap } from "@/lib/constants/users/managerWorker";
import dbConnect from "@/lib/db/mongooseConnect";
import { Receipt } from "@/models/sectors/sales";
import { ShipmentItem } from "@/models/sectors/sales/Shipment";
import { Worker } from "@/models/user/workers";

export async function POST(req) {
  try {
    await dbConnect();
    let { specificManager, worker, unauthorized } = await fetchManagerWorker({
      managerNames: [FINANCIAL_MANAGER],
      workerType: managerMorkerMap[FINANCIAL_MANAGER],
    });

    if (unauthorized) {
      return Response.json(
        { message: "Nemate pravo izrade otpremnica" },
        { status: 403 },
      );
    }

    const { shipmentItemId, workerId } = await req.json();

    const requestWorker = await Worker.findById(workerId);

    const shipmentItem = await ShipmentItem.findById(shipmentItemId).populate([
      {
        path: "shipment",
        select: "warehouseRequest",
        populate: {
          path: "warehouseRequest",
          select: "order",
          populate: {
            path: "order",
            select: "receipts",
          },
        },
      },
    ]);

    if (!shipmentItem) {
      return Response.json(
        { error: "Stavka pošiljke nije pronađena" },
        { status: 404 },
      );
    }

    const newReceipt = new Receipt({
      shipmentItem: shipmentItem._id,
      financialWorker: workerId,
    });

    requestWorker.receipts.push(newReceipt._id);
    shipmentItem.shipment.warehouseRequest.order.receipts.push(newReceipt._id);
    shipmentItem.receipt = newReceipt._id;

    await newReceipt.save();
    await shipmentItem.shipment.warehouseRequest.order.save();
    await shipmentItem.save();
    await requestWorker.save();

    return Response.json({ newReceipt, message: "Račun uspješno kreiran" });
  } catch (error) {
    console.error("Error creating receipt:", error);
    return Response.json({
      error: "Greška prilikom kreiranja računa",
    });
  }
}
