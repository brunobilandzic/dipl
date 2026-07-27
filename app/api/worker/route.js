import dbConnect from "@/lib/db/mongooseConnect";
import populateCommon, {
  cultivationPopulate,
  productionPopulate,
  warehousePopulate,
  financialPopulate,
} from "@/lib/workers/populate";
import { Worker } from "@/models/user/workers";

export async function GET(request) {
  console.log("worker route called..")
  try {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("workerId");
    await dbConnect();

    const worker = await Worker.findById(workerId).populate(populateCommon);

    if (!worker) {
      return Response.json(
        { error: "Radnik nije pronađen", workerId },
        { status: 404 },
      );
    }

    switch (worker.__t) {
      case "CultivationWorker":
        await worker.populate(cultivationPopulate);
        break;
      case "ProductionWorker":
        await worker.populate(productionPopulate);
        break;
      case "WarehouseWorker":
        await worker.populate(warehousePopulate);
        break;
      case "FinancialWorker":
        await worker.populate(financialPopulate);
        break;
    }
    return Response.json({ worker });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
