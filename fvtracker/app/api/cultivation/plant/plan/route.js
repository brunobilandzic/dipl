import { fetchSessionSpecificManager } from "@/lib/auth/fetchSessionData";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";
import cultivation from "@/lib/cultivation";
import { populatePlans } from "@/lib/cultivation/plans";
import dbConnect from "@/lib/db/mongooseConnect";

export async function POST(request) {
  try {
    await dbConnect();
    await fetchSessionSpecificManager({ managerName: CULTIVATION_MANAGER });
    const body = await request.json();
    const newPlantingPlan = await cultivation.plans.createPlantingPlan({
      plantingPlanData: body,
    });
    await populatePlans({ plans: [newPlantingPlan] });
    return Response.json({ newPlantingPlan }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    await fetchSessionSpecificManager({ managerName: CULTIVATION_MANAGER });

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

export async function PUT(request) {
  try {
    await dbConnect();
    await fetchSessionSpecificManager({ managerName: CULTIVATION_MANAGER });
    const body = await request.json();
    const { planId, ...planData } = body;

    if (!planId) {
      return Response.json({ error: "planId is required" }, { status: 400 });
    }

    const updatedPlantingPlan = await cultivation.plans.updatePlantingPlan({
      planId,
      plantingPlanData: planData,
    });

    return Response.json({ updatedPlantingPlan }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
