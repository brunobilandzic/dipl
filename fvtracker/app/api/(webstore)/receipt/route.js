import { fetchManager } from "@/lib/auth/fetchSessionData";
import { FINANCIAL_MANAGER } from "@/lib/constants/users/managerTypes";
import { Receipt } from "@/models/sectors/sales";
import { ShipmentItem } from "@/models/sectors/sales/Shipment";

export async function POST(req) {
  try {
    console.log("Received request to create receipt");
    const { specificManager: financialManager, unauthorized } =
      await fetchManager({
        managerNames: [FINANCIAL_MANAGER],
      });
    if (unauthorized) {
      return Response.json({ error: "Nema dozvole" }, { status: 403 });
    }

    const { shipmentItemId } = await req.json();

    const shipmentItem = await ShipmentItem.findById(shipmentItemId);

    if (!shipmentItem) {
      return Response.json(
        { error: "Stavka pošiljke nije pronađena" },
        { status: 404 },
      );
    }

    const newReceipt = new Receipt({
      shipmentItem: shipmentItem._id,
    });

    shipmentItem.receipt = newReceipt._id;

    await newReceipt.save();
    await shipmentItem.save();

    return Response.json({ newReceipt, message: "Račun uspješno kreiran" });
  } catch (error) {
    console.error("Error creating receipt:", error);
    return Response.json({
      error: "Greška prilikom kreiranja računa",
    });
  }
}
