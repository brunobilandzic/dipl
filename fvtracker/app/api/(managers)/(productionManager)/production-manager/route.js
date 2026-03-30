import { fetchManager } from "@/lib/auth/fetchSessionData";
import { PRODUCTION_MANAGER } from "@/lib/constants/users/managerTypes";

export async function GET(request) {
  try {
    const { generalManager, specificManager: productionManager } =
      await fetchManager({
        managerNames: [PRODUCTION_MANAGER],
      });

    return Response.json({ productionManager });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch production manager" },
      { status: 500 },
    );
  }
}
