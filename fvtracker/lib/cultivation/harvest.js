import { HarvestingPlan } from "@/models/documents/plans/HarvestingPlan";
import { getCultivationById } from "./cultivation";
import { PlantedCropVariety } from "@/models/sectors/cultivation/Crops";

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
  let plantedCropVarieties = await PlantedCropVariety.find({
    cultivation: cultivationId,
  }).populate("plantingPlanItem");
  
  plantedCropVarieties = plantedCropVarieties.filter(
    (pcv) => pcv.plantingPlanItem?.cropVariety.toString() === cropVarietyId,
  );
  const harvestingPlan = await getHarvestingPlanById(harvestingPlanId);

  console.log({ plantedCropVarieties, harvestingPlan, toHarvestCells });
}

const harvestCell = async ({ plantingPlanItem, relativeCoords }) => {};
