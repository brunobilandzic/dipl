import cultivation from "@/lib/cultivation";
import { harvestCells } from "@/lib/cultivation/harvest";

export async function POST(req) {
  try {
    const body = await req.json();
    const newHarvest = body;
    console.log({ newHarvest });
    const harvestedCropVarieties = await harvestCells(newHarvest);
    return Response.json(
      { message: "New harvest created", harvestedCropVarieties },
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
