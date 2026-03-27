import { HarvestingPlan } from "@/models/documents/plans/HarvestingPlan";
import { getCultivationById } from "./cultivation";
export async function getHarvestingPlanById(id) {
  const harvestingPlan = await HarvestingPlan.findById(id);
  if (!harvestingPlan) {
    throw new Error("Harvesting plan not found.");
  }
  return harvestingPlan;
}

export async function harvestCells({
  cultivationId,
  cropVarietyId,
  toHarvestCells,
  harvestingPlanId,
}) {
const harvestCell = async ({ plantingPlanItem, relativeCoords }) => {};
