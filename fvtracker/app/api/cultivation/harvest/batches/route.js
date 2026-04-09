import { fetchManager } from "@/lib/auth/fetchSessionData";
import {
  CULTIVATION_MANAGER,
  PRODUCTION_MANAGER,
} from "@/lib/constants/users/managerTypes";
import {
  getHarvestingBatches,
  populateBatches,
} from "@/lib/cultivation/harvest/batches";
import dbConnect from "@/lib/db/mongooseConnect";
import { HarvestingBatch } from "@/models/sectors/interface/HarvestingBatch";

export async function GET(req) {
  try {
    await dbConnect();
    const { specificManager, generalManager } = await fetchManager({
      managerNames: [CULTIVATION_MANAGER, PRODUCTION_MANAGER],
    });

    if (generalManager) {
      let harvestingBatches = await HarvestingBatch.find();
      harvestingBatches = await populateBatches({ harvestingBatches });
      return Response.json({ harvestingBatches }, { status: 200 });
    }
    // manager of intest is first in array
    const harvestingBatches = await getHarvestingBatches({
      managerName: specificManager.managerModelName,
    });
    return Response.json({ harvestingBatches }, { status: 200 });
  } catch (error) {
    console.error("Error fetching harvesting batches:", error);
    return Response.json(
      { error: "Failed to fetch harvesting batches" },
      { status: 500 },
    );
  }
}
