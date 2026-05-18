import { fetchManager } from "@/lib/auth/fetchSessionData";
import {
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";

export async function POST(request) {
  const { specificManager, generalManager, unauthorized } = await fetchManager({
    managerNames: [WAREHOUSE_MANAGER],
  });
  if (!specificManager || unauthorized) {
    return Response.json({ message: "Unauthorized" }, { status: 403 });
  }
  const { warehouseRequestId, shipmentSources } = await request.json();
  console.log({ warehouseRequestId, shipmentSources });

  return Response.json({ message: "Warehouse request filled successfully" });
}
