import { PlantedCropVariety } from "@/models/sectors/cultivation/Crops";
import { getHarvestingPlanById } from "./plan";
import { HarvestWork } from "@/models/user/workers/CultivationWork";
import { HarvestingPlan } from "@/models/documents/plans/HarvestingPlan";
import { populateConfigCropVariety } from "../populate";

export async function harvestCells({
  cultivationId,
  cropVarietyId,
  toHarvestCells,
  harvestingPlanId,
  workerId,
  quality,
}) {
  const harvestingPlan = await HarvestingPlan.findById(
    harvestingPlanId,
    "items harvestingBatch",
  ).populate([
    {
      path: "items",
      select: "cropVariety quantity plantedCropVarieties",
      populate: { path: "cropVariety", populate: populateConfigCropVariety },
    },
    {
      path: "harvestingBatch",
    }
  ]); 
  const harvestingPlanItem = harvestingPlan.items.find(
    (item) => item.cropVariety._id.toString() === cropVarietyId,
  );
  if (!harvestingPlanItem) {
    throw new Error("Stavka plana nije pronađena.");
  }

  const plantedCropVarieties = await PlantedCropVariety.find(
    { relativeCoords: { $in: toHarvestCells } },
    "relativeCoords _id",
  );

  const { harvestWork } =
    await harvestingPlan.harvestingBatch.addPlantedCropVarieties({
      harvestingPlanItem,
      plantedCropVarietiesIds: plantedCropVarieties.map((pcv) => pcv._id),
      cropVarietyId,
      quality,
      workerId,
      cultivationId,
      harvestedCoords: toHarvestCells,
    });

  return { harvestWork, harvestedCropVarieties: plantedCropVarieties };
}
