import { fetchManager } from "@/lib/auth/fetchSessionData";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";
import dbConnect from "@/lib/db/mongooseConnect";
import { getWorkers } from "@/lib/workers/get";

export async function GET(req) {
  try {
    const { searchParams } = new URL(request.url);
    await dbConnect();
    const { specificManager: cultivationManager, unauthorized } =
      await fetchManager({
        managerModelNames: [CULTIVATION_MANAGER],
      });
    if (unauthorized) {
      return Response.json(
        { error: "Nemate pravo pristupa radnicima" },
        { status: 403 },
      );
    }
    const workers = await getWorkers({
      rootManagerId: cultivationManager.rootManager,
      managerModelName: CULTIVATION_MANAGER,
    });
    return Response.json({ workers });
  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json(
      { error: "Greška pri dohvaćanju radnika" },
      { status: 500 },
    );
  }
}
