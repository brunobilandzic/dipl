import cultivation from "@/lib/cultivation";
import dbConnect from "@/lib/db/mongooseConnect";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newHarvestPlan = await cultivation.harvestPlans.createHarvestPlan({
      harvestPlanData: body,
    });
    await newHarvestPlan.populate([
      {
        path: "items",
        populate: {
          path: "cropVariety",
          populate: { path: "cropType" },
        },
      },
      {
        path: "field",
        select: "name _id",
      },
    ]);
    console.log("Created new harvest plan:", newHarvestPlan);
    return Response.json({ newHarvestPlan }, { status: 201 });
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

    await cultivation.harvestPlans.deleteHarvestPlans({ fieldId, planId });
    return Response.json({ message: "Harvest plans deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
