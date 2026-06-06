import { getMachines } from "@/lib/production/stocks/machines";
import dbConnect from "@/lib/db/mongooseConnect";

export async function GET() {
  try {
    await dbConnect();
    const machines = await getMachines();
    return Response.json({ machines }, { status: 200 });
  } catch (error) {
    console.error("Error fetching machines:", error);
    return Response.json(
      { error: "Failed to fetch machines" },
      { status: 500 },
    );
  }
}
