import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";
import { harvestCells } from "@/lib/cultivation/harvest";
import dbConnect from "@/lib/db/mongooseConnect";

export async function POST(req) {
  try {
    await dbConnect();
    await fetchSessionSpecificManager({ managerName: CULTIVATION_MANAGER });
    const body = await req.json();
    const newHarvest = body;
    console.log({ newHarvest });
    const harvestedCropVarieties = await harvestCells(newHarvest);
    return Response.json({ harvestedCropVarieties }, { status: 201 });
  } catch (error) {
    console.error("Error creating new harvest:", error);
    return Response.json(
      { message: "Error creating new harvest" },
      { status: 500 },
    );
  }
}
