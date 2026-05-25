import { fetchManager } from "@/lib/auth/fetchSessionData";
import dbConnect from "@/lib/db/mongooseConnect";
import { getWorkers } from "@/lib/workers/get";

export async function GET(req) {
  try {
    const managerModelName = req.nextUrl.searchParams.get("managerModelName");
    await dbConnect();
    const { specificManager, unauthorized } = await fetchManager({
      managerNames: [managerModelName],
    });
    if (unauthorized) {
      return Response.json(
        { error: "Nemate pravo pristupa radnicima" },
        { status: 403 },
      );
    }
    const workers = await getWorkers({
      rootManagerId: specificManager.rootManager._id,
      managerModelName: managerModelName,
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
