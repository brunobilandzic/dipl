import { fetchManager, isAuthorizedGeneralManager } from "@/lib/auth/fetchSessionData";
import { PRODUCTION_MANAGER } from "@/lib/constants/users/managerTypes";
import dbConnect from "@/lib/db/mongooseConnect";
import { getHarvestingBatches } from "@/lib/cultivation/harvest/batches";

export async function GET() {
  try {
    await dbConnect();
    const isGeneralManager = await isAuthorizedGeneralManager();
    if (isGeneralManager) {
      const harvestingBatches = await getHarvestingBatches({
        managerName: PRODUCTION_MANAGER,
      });
      return Response.json({ harvestingBatches }, { status: 200 });
    }

    await fetchManager({
      managerNames: [PRODUCTION_MANAGER],
    });
    const harvestingBatches = await getHarvestingBatches({
      managerName: PRODUCTION_MANAGER,
    });
    return Response.json({ harvestingBatches }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
