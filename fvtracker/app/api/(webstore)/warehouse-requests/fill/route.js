import { fetchManager } from "@/lib/auth/fetchSessionData";
import { WAREHOUSE_MANAGER } from "@/lib/constants/users/managerTypes";
import { fillWarehouseRequest } from "@/lib/warehouses/warehouseRequests";

export async function POST(request) {
  try {
    const { specificManager, generalManager, unauthorized } =
      await fetchManager({
        managerNames: [WAREHOUSE_MANAGER],
      });
    if (!specificManager || unauthorized) {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }
    const { warehouseRequestId, shipmentSources } = await request.json();
    await fillWarehouseRequest({ warehouseRequestId, shipmentSources });

    return Response.json({ message: "Warehouse request filled successfully" });
  } catch (error) {
    console.error("Error filling warehouse request:", error);
    return Response.json(
      { message: "Error filling warehouse request" },
      { status: 500 },
    );
  }
}
