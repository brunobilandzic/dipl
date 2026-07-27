import { fetchManager, fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import { WAREHOUSE_MANAGER } from "@/lib/constants/users/managerTypes";
import { fillWarehouseRequest } from "@/lib/warehouses/warehouseRequests";
import { managerMorkerMap } from "@/lib/constants/users/managerWorker";
import dbConnect from "@/lib/db/mongooseConnect";

export async function POST(request) {
  try {
    await dbConnect();
    let {
      specificManager,
      worker: warehouseWorker,
      unauthorized,
    } = await fetchManagerWorker({
      managerNames: [WAREHOUSE_MANAGER],
      workerType: managerMorkerMap[WAREHOUSE_MANAGER],
    });

    if (unauthorized) {
      return Response.json(
        { message: "Nemate pravo izrade otpremnica" },
        { status: 403 },
      );
    }
    const { warehouseRequestId, shipmentSources, workerId } =
      await request.json();
    const result = await fillWarehouseRequest({
      warehouseRequestId,
      shipmentSources,
      workerId,
    });
    return Response.json({ ...result });
  } catch (error) {
    console.error("Error filling warehouse request:", error);
    return Response.json(
      { message: "Error filling warehouse request" },
      { status: 500 },
    );
  }
}
