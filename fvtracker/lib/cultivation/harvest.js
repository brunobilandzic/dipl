import { HarvestingPlan } from "@/models/documents/plans/HarvestingPlan";
import { getCultivationById } from "./cultivation";
export async function getHarvestingPlanById(id) {
  const harvestingPlan = await HarvestingPlan.findById(id);
  if (!harvestingPlan) {
    throw new Error("Harvesting plan not found.");
  }
  return harvestingPlan;
}

export async function harvestRelativeCells({
    cultivationId,
    cropVarietyId,
    plantingPlanId,
}) {
    const cultivation = await getCultivationById(cultivationId);
    await cultivation.populate({ path: "cultivationArea", select: "planted" });

 }