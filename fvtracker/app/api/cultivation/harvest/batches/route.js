import { getHarvestingBatches } from "@/lib/cultivation/harvest";

export async function GET(req) {
  try {
    const batches = await getHarvestingBatches();
    return Response.json(batches);
  } catch (error) {
    console.error("Error fetching harvesting batches:", error);
    return Response.json(
      { error: "Failed to fetch harvesting batches" },
      { status: 500 },
    );
  }
}
