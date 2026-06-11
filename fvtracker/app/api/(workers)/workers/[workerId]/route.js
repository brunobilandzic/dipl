import { cultivationPopulate } from "@/lib/workers/populate";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("workerId");
    await dbConnect();

    const worker = await Worker.findById(workerId);

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
S;
