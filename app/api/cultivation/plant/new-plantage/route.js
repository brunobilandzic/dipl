import {
  fetchManagerWorker,
  fetchSessionSpecificManager,
} from "@/lib/auth/fetchSessionData";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";
import { managerMorkerMap } from "@/lib/constants/users/managerWorker";
import cultivation from "@/lib/cultivation";
import dbConnect from "@/lib/db/mongooseConnect";

export async function POST(request) {
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
    const body = await request.json();
    const { plantedCropVarieties: newPlantage, plantageWork } =
      await cultivation.plants.create(body);
    return Response.json({ newPlantage, plantageWork }, { status: 200 });
  } catch (error) {
    console.error("Error creating plantage:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
