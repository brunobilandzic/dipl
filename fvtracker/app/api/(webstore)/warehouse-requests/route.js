import { fetchManager } from "@/lib/auth/fetchSessionData";
import { FINANCIAL_MANAGER, WAREHOUSE_MANAGER } from "@/lib/constants/users/managerTypes";
import {
  createWarehouseRequest,
  getWarehouseRequests,
} from "@/lib/warehouses/warehouseRequests";

export async function GET(request) {
  console.log("Received GET request for warehouse requests");
  try {
    const { unauthorized } = await fetchManager({
      managerNames: [FINANCIAL_MANAGER, WAREHOUSE_MANAGER],
    });
    if (unauthorized) {
      return Response.json(
        { message: "Nemate pravo pristupa" },
        { status: 403 },
      );
    }
    const warehouseRequests = await getWarehouseRequests();
    return Response.json({ warehouseRequests });
  } catch (error) {
    console.error("Error fetching warehouse requests:", error);
    return new Response(
      JSON.stringify({
        message: "Greška prilikom dohvaćanja zahtjeva skladištu.",
      }),
      { status: 500 },
    );
  }
}
export async function POST(request) {
  try {
    const { unauthorized, specificManager: financialManager } =
      await fetchManager({
        managerNames: [FINANCIAL_MANAGER],
      });
    if (unauthorized) {
      return Response.json(
        { message: "Nemate pravo pristupa" },
        { status: 403 },
      );
    }

    const requestData = await request.json();
    requestData["financialManagerId"] = financialManager._id.toString();
    const warehouseRequest = await createWarehouseRequest(requestData);
    return Response.json({ message: "Zahtjev uspješno poslan skladištu." });
  } catch (error) {
    console.error("Error creating warehouse request:", error);
    return Response.json(
      { message: "Greška prilikom izrade zahtjeva skladištu." },
      { status: 500 },
    );
  }
}
