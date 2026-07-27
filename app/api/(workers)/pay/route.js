import { fetchManager } from "@/lib/auth/fetchSessionData";
import dbConnect from "@/lib/db/mongooseConnect";
import { MANAGER_TYPES } from "@/lib/constants/users/managerTypes";
import { Worker } from "@/models/user/workers";
import basePopulate, {
  cultivationPopulate,
  financialPopulate,
  productionPopulate,
  warehousePopulate,
} from "@/lib/workers/populate";
import {
  CULTIVATION_MANAGER,
  FINANCIAL_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";

export async function POST(req) {
  try {
    await dbConnect();
    const { specificManager, gerneralManager, unauthorized } =
      await fetchManager({ managerNames: MANAGER_TYPES });
    const { workerId, amount } = await req.json();

    if (unauthorized || (!specificManager && !gerneralManager)) {
      return Response.json(
        { message: "Nemate pravo isplatiti radnika" },
        { status: 403 },
      );
    }
    const worker = await Worker.findByIdAndUpdate(
      workerId,
      { $inc: { payedAmount: amount } },
      { new: true },
    );
    await worker.populate(basePopulate);
    let populate;
    switch (worker.manager.managerModelName) {
      case CULTIVATION_MANAGER:
        populate = cultivationPopulate;
        break;
      case PRODUCTION_MANAGER:
        populate = productionPopulate;
        break;
      case WAREHOUSE_MANAGER:
        populate = warehousePopulate;
        break;
      case FINANCIAL_MANAGER:
        populate = financialPopulate;
        break;
      default:
        throw new Error(
          `Unknown worker type: ${worker.manager.managerModelName}`,
        );
    }
    await worker.populate(populate);

    return Response.json(
      { message: `Radnik ${workerId} isplaćen za iznos ${amount}.`, worker },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing payment request:", error);
    return Response.json(
      { message: "Došlo je do greške pri obradi zahtjeva za isplatu." },
      { status: 500 },
    );
  }
}
