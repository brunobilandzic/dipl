import { fetchManager } from "@/lib/auth/fetchSessionData";
import dbConnect from "@/lib/db/mongooseConnect";
import {
  CULTIVATION_MANAGER,
  PRODUCTION_MANAGER,
} from "@/lib/constants/users/managerTypes";
import { ProductionManager } from "@/models/user/managers/ProductionManager";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const queryAll = searchParams.get("all");
    const { generalManager, specificManager: productionManager } =
      await fetchManager({
        managerNames: [PRODUCTION_MANAGER, CULTIVATION_MANAGER],
      });
    if (queryAll) {
      const productionManagers = await ProductionManager.find({}).populate({
        path: "rootManager",
        select: "appUser",
        populate: {
          path: "appUser",
          select: "name surname",
        },
      });

      return Response.json({ productionManagers });
    }
    return Response.json({ productionManager });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch production manager" },
      { status: 500 },
    );
  }
}
