import { fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";
import { managerMorkerMap } from "@/lib/constants/users/managerWorker";
import { harvestCells } from "@/lib/cultivation/harvest";
import dbConnect from "@/lib/db/mongooseConnect";

export async function POST(req) {
  try {
    await dbConnect();
    const {
      specificManager: cultvationManager,
      worker,
      unauthorized,
    } = await fetchManagerWorker({
      managerNames: [CULTIVATION_MANAGER],
      workerType: managerMorkerMap[CULTIVATION_MANAGER],
    });
    if (unauthorized) {
      return Response.json(
        { success: false, error: "Nemate pravo izrade novog zasada" },
        { status: 403 },
      );
    }
    const body = await req.json();
    const newHarvest = body;
    const { harvestWork, harvestedCropVarieties } =
      await harvestCells(newHarvest);
    return Response.json(
      { harvestWork, harvestedCropVarieties },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating new harvest:", error);
    return Response.json(
      { message: "Error creating new harvest" },
      { status: 500 },
    );
  }
}
