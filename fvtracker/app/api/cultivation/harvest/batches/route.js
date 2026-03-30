import { GENERAL_MANAGER } from "@/lib/constants/users/managerTypes";
import {
  getHarvestingBatches,
  populateBatches,
} from "@/lib/cultivation/harvest";
import dbConnect from "@/lib/db/mongooseConnect";
import { HarvestingBatch } from "@/models/sectors/interface/HarvestingBatch";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const managerName = searchParams.get("managerName");
    if (managerName === GENERAL_MANAGER) {
      let harvestingBatches = await HarvestingBatch.find();
      harvestingBatches = await populateBatches({ harvestingBatches });
      return Response.json({ harvestingBatches }, { status: 200 });
    }
    const harvestingBatches = await getHarvestingBatches({ managerName });
    return Response.json({ harvestingBatches }, { status: 200 });
  } catch (error) {
    console.error("Error fetching harvesting batches:", error);
    return Response.json(
      { error: "Failed to fetch harvesting batches" },
      { status: 500 },
    );
  }
}
