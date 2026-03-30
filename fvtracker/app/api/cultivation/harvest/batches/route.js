import {
  getHarvestingBatches,
  populateBatches,
} from "@/lib/cultivation/harvest";

export async function GET(req) {
  try {
    const { searchParams } = new URL(request.url);
    const managerName = searchParams.get("managerName");
  } catch (error) {
    console.error("Error fetching harvesting batches:", error);
    return Response.json(
      { error: "Failed to fetch harvesting batches" },
      { status: 500 },
    );
  }
}
