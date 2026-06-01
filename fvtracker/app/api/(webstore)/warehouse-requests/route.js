import { fetchManager, fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import {
  FINANCIAL_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";
import { managerMorkerMap } from "@/lib/constants/users/managerWorker";
import {
  createWarehouseRequest,
  getWarehouseRequests,
} from "@/lib/warehouses/warehouseRequests";

export async function GET(request) {
  console.log("Received GET request for warehouse requests");
  try {
    let { specificManager, worker, unauthorized } = await fetchManagerWorker({
      managerNames: [WAREHOUSE_MANAGER, FINANCIAL_MANAGER],
      workerType: managerMorkerMap[WAREHOUSE_MANAGER],
    });

    if (unauthorized) {
      return Response.json(
        { message: "Nemate pravo izrade otpremnica" },
        { status: 403 },
      );
    }
    let warehouseManagerId =
      specificManager?.rootManager.managerModelName === WAREHOUSE_MANAGER
        ? specificManager._id
        : null;
    let financialManagerId =
      specificManager?.rootManager.managerModelName === FINANCIAL_MANAGER
        ? specificManager._id
        : null;

    if (worker && worker.manager) {
      if (worker.manager.managerModelName === WAREHOUSE_MANAGER) {
        warehouseManagerId = worker.manager._id;
      } else if (worker.manager.managerModelName === FINANCIAL_MANAGER) {
        financialManagerId = worker.manager._id;
      }
    }
    console.log({ worker, unauthorized });
    console.log({
      specificManager,
      warehouseManagerId,
      financialManagerId,
      route: true,
    });
    const warehouseRequests = await getWarehouseRequests({
      financialManagerId,
      warehouseManagerId,
    });
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
    let {
      specificManager: financialManager,
      worker,
      unauthorized,
    } = await fetchManagerWorker({
      managerNames: [FINANCIAL_MANAGER],
      workerType: managerMorkerMap[FINANCIAL_MANAGER],
    });
    if (unauthorized) {
      return Response.json(
        { message: "Nemate pravo pristupa" },
        { status: 403 },
      );
    }

    const requestData = await request.json();
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
