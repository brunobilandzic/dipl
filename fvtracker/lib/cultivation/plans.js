import { PlantingPlan, PlantingPlanItem } from "@/models/documents/PlantingPlan";
import auth from "@/lib/auth";
import { fetchFieldById } from "./fields";

export async function deletePlantingPlans({ fieldId, planId }) {
  await deletePlansFromField({ fieldId, planId });
  await deletePlantingPlanItems({ planId });
  await deletePlantingPlanRecords({ planId });
}

const deletePlantingPlanItems = async ({ planId }) => {
  const filter = planId ? { plantingPlan: planId } : {};
  await PlantingPlanItem.deleteMany(filter);
};

const deletePlantingPlanRecords = async ({ planId }) => {
  if (!planId) await PlantingPlan.deleteMany({});
  else await PlantingPlan.findByIdAndDelete(planId);
};

export async function createPlantingPlan({ plantingPlanData }) {
  await auth.session.specificManager({
    managerName: "CultivationManager",
  });

  const field = await fetchFieldById(plantingPlanData.field);

  const plantingPlan = new PlantingPlan({
    ...plantingPlanData,
  });
  field.plantingPlans.push(plantingPlan._id);

  await field.save();
  await plantingPlan.save();
  return plantingPlan;
}
