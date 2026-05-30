import { fetchManager, fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import { PRODUCTION_MANAGER } from "@/lib/constants/users/managerTypes";
import { managerMorkerMap } from "@/lib/constants/users/managerWorker";
import { ProductionManager } from "@/models/user/managers/ProductionManager";

// here is the place we fetch all production data

export async function GET(request) {
  let {
    specificManager,
    worker: productionWorker,
    unauthorized,
  } = await fetchManagerWorker({
    managerNames: [PRODUCTION_MANAGER],
    workerType: managerMorkerMap[PRODUCTION_MANAGER],
  });

  if (unauthorized) {
    return Response.json({ unauthorized: true }, { status: 403 });
  }
  const productionManager = await ProductionManager.findOne().populate([
    {
      path: "products",
      populate: [
        {
          path: "ingredients",
          select: "cropVariety quantity",
          populate: {
            path: "cropVariety",
            select: "name cropType",
            populate: {
              path: "cropType",
              select: "name",
            },
          },
        },
        {
          path: "productionStocks",
          populate: [
            {
              path: "facility",
            },
          ],
        },
        {
          path: "warehouseStocks",
          populate: [
            {
              path: "warehouse",
            },
            {
              path: "warehouseAcceptanceProcesses",
            },
          ],
        },
      ],
    },
  ]);

  return Response.json({ productionManager }, { status: 200 });
}
