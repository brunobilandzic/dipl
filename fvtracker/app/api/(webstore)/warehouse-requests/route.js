import { fetchManager, fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import dbConnect from "@/lib/db/mongooseConnect";
import {
  FINANCIAL_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";
import { managerMorkerMap } from "@/lib/constants/users/managerWorker";
import {
  createWarehouseRequest,
  getWarehouseRequests,
} from "@/lib/warehouses/warehouseRequests";
import { FinancialManager } from "@/models/user/managers/FinancialManager";
import { WarehouseManager } from "@/models/user/managers/WarehouseManager";

export async function GET(request) {
  try {
    await dbConnect();
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

    let { financialManagerId, warehouseManagerId } = await extractManagerIds(
      specificManager,
      worker,
    );

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
async function extractManagerIds(specificManager, worker) {
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
      const warehouseManager = await WarehouseManager.findOne({
        rootManager: worker.manager._id,
      }).select("_id");
      warehouseManagerId = warehouseManager._id;
    } else if (worker.manager.managerModelName === FINANCIAL_MANAGER) {
      const financialManager = await FinancialManager.findOne({
        rootManager: worker.manager._id,
      }).select("_id");
      financialManagerId = financialManager._id;
    }
  }
  return { financialManagerId, warehouseManagerId };
}

export async function POST(request) {
  try {
    await dbConnect();
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
    const { financialManagerId } = await extractManagerIds(
      financialManager,
      worker,
    );
    requestData["financialManager"] = financialManagerId;
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
