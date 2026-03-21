import cultivation from "@/lib/cultivation";
import dbConnect from "@/lib/db/mongooseConnect";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newPlantingPlan = await cultivation.plans.createPlantingPlan({
      plantingPlanData: body,
    });
    await newPlantingPlan.populate([
      {
        path: "items",
        populate: [
          {
            path: "cropVariety",
            populate: {
              path: "cropType",
            },
          },
          {
            path: "plantedCropVarieties",
            populate: {
              path: "cultivation",
              select: "name",
            },
          },
        ],
      },
      {
        path: "field",
        select: "name _id",
      },
    ]);
    console.log("Created new planting plan:", newPlantingPlan);
    return Response.json({ newPlantingPlan }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();

    let fieldId, planId;
    try {
      const body = await request.json();
      ({ fieldId, planId } = body);
    } catch {
      // no body - delete all
    }

    await cultivation.plans.deletePlantingPlans({ fieldId, planId });
    return Response.json(
      { message: "Planting plans deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
