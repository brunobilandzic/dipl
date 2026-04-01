import { HarvestingPlan } from "@/models/documents/plans/HarvestingPlan";
import { PlantingPlan } from "@/models/documents/plans/PlantingPlan";
import { planInfo } from "../data/fields";
import {
  createHarvestingPlan,
  createPlantingPlan,
} from "@/lib/cultivation/plans";

export async function createPlans({ fieldId, cropVarietyId }) {
  await HarvestingPlan.deleteMany({});
  await PlantingPlan.deleteMany({});

  console.log({ fieldId, cropVarietyId });
  const { plantingPlan, harvestingPlan } = planInfo({ fieldId, cropVarietyId });
  const newPlantingPlan = await createPlantingPlan({
    plantingPlanData: plantingPlan,
  });
  const newHarvestingPlan = await createHarvestingPlan({
    harvestingPlanData: harvestingPlan,
  });
  console.log(
    `Created planting plan ${newPlantingPlan.name} and harvesting plan ${newHarvestingPlan.name} for field ${fieldId}.`,
  );

  return { newPlantingPlan, newHarvestingPlan };
}
