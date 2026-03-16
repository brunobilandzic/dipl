import { createPlantingPlan } from "@/lib/cultivation/plant";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newPlantingPlan = await createPlantingPlan(body);

    return Response.json(newPlantingPlan, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
