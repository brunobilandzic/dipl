import cultivation from "@/lib/cultivation";
import dbConnect from "@/lib/db/mongooseConnect";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newHarvestingPlan = await cultivation.plans.createHarvestingPlan({
      harvestingPlanData: body,
    });
    await newHarvestingPlan.populate([
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
    console.log("Created new harvesting plan:", newHarvestingPlan);
    return Response.json({ newHarvestingPlan }, { status: 201 });
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

    await cultivation.plans.deleteHarvestingPlans({ fieldId, planId });
    return Response.json(
      { message: "Harvesting plans deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { planId, ...planData } = body;

    if (!planId) {
      return Response.json({ error: "planId is required" }, { status: 400 });
    }

    const updatedHarvestingPlan = await cultivation.plans.updateHarvestingPlan({
      planId,
      harvestingPlanData: planData,
    });

    return Response.json({ updatedHarvestingPlan }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
