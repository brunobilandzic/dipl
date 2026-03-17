import { createPlantingPlan } from "@/lib/cultivation/plant";
import dbConnect from "@/lib/db/mongooseConnect";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newPlantingPlan = await createPlantingPlan({ plantingPlanData: body });
    console.log("Created new planting plan:", newPlantingPlan);
    return Response.json(newPlantingPlan, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
