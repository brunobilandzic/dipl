import { fetchManager } from "@/lib/auth/fetchSessionData";
import { PRODUCTION_MANAGER } from "@/lib/constants/users/managerTypes";
import dbConnect from "@/lib/db/mongooseConnect";
import { getHarvestingBatches } from "@/lib/production/resources";

export async function GET() {
  try {
    await dbConnect();
    await fetchManager({
      managerNames: [PRODUCTION_MANAGER],
    });
    const harvestingBatches = await getHarvestingBatches();
    return Response.json({ harvestingBatches }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
