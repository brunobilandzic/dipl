import { fetchManager, fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import {
  FINANCIAL_MANAGER,
  PRODUCTION_MANAGER,
} from "@/lib/constants/users/managerTypes";
import { managerMorkerMap } from "@/lib/constants/users/managerWorker";
import { ProductionManager } from "@/models/user/managers/ProductionManager";
import { populateProductsConfig } from "../populate";

// here is the place we fetch all production data

export async function GET(request) {
  let {
    specificManager,
    worker: productionWorker,
    generalManager,
    unauthorized,
  } = await fetchManagerWorker({
    managerNames: [PRODUCTION_MANAGER, FINANCIAL_MANAGER],
    workerType: managerMorkerMap[PRODUCTION_MANAGER],
  });

  if (unauthorized) {
    return Response.json({ unauthorized: true }, { status: 403 });
  }
  if (
    generalManager ||
    specificManager?.rootManager.managerModelName === FINANCIAL_MANAGER
  ) {
    const productionManagers = await ProductionManager.find().populate(
      populateProductsConfig,
    );
    return Response.json({ productionManagers }, { status: 200 });
  }
  const productionManager = await ProductionManager.findOne().populate([
    {
      path: "products",
      populate: populateProductsConfig,
    },
  ]);

  return Response.json({ productionManager }, { status: 200 });
}
