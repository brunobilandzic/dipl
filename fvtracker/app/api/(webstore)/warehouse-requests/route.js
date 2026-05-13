import { fetchManager } from "@/lib/auth/fetchSessionData";
import { FINANCIAL_MANAGER } from "@/lib/constants/users/managerTypes";
import { createWarehouseRequest } from "@/models/sectors/sales/warehouseRequests";

export async function GET(request) {
  console.log("Received GET request for warehouse requests");
  try {
    const { unauthorized } = await fetchManager({
      managerNames: [FINANCIAL_MANAGER],
    });
    if (unauthorized) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
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
    const { unauthorized } = await fetchManager({
      managerNames: [FINANCIAL_MANAGER],
    });
    if (unauthorized) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const requestData = await request.json();
    const warehouseRequest = await createWarehouseRequest(requestData);
    return Response.json({ message: "Zahtjev uspješno poslan skladištu." });
  } catch (error) {
    console.error("Error creating warehouse request:", error);
    return new Response(
      JSON.stringify({ message: "Greška prilikom izrade zahtjeva skladištu." }),
      { status: 500 },
    );
  }
}
