import { HarvestingPlan } from "@/models/documents/plans/HarvestingPlan";
import { getCultivationById } from "../cultivation";
import { PlantedCropVariety } from "@/models/sectors/cultivation/Crops";
import {
  CULTIVATION_MANAGER,
  PRODUCTION_MANAGER,
} from "../../constants/users/managerTypes";
import { HarvestingBatch } from "@/models/sectors/interface/HarvestingBatch";
import { fetchSessionSpecificManager } from "../../auth/fetchSessionData";
import { getHarvestingPlanById } from "./plan";



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
    (pcv) =>
      pcv.plantingPlanItem?.cropVariety.toString() === cropVarietyId &&
      toHarvestCells.includes(pcv.relativeCoords),
  );

  const harvestingPlan = await getHarvestingPlanById(harvestingPlanId);
  await harvestingPlan.populate([
    {
      path: "items",
      select: "cropVariety quantity plantedCropVarieties",
      populate: { path: "cropVariety", select: "quantityPerCell" },
    },
    { path: "harvestingBatch" },
  ]);

  const harvestingPlanItem = harvestingPlan.items.find(
    (item) => item.cropVariety._id.toString() === cropVarietyId,
  );
  if (!harvestingPlanItem) {
    throw new Error(
      "Harvesting plan item not found for the given crop variety.",
    );
  }

  harvestingPlanItem.plantedCropVarieties.push(
    ...plantedCropVarieties.map((pcv) => pcv._id),
  );
  harvestingPlanItem.quantity -=
    plantedCropVarieties.length *
    harvestingPlanItem.cropVariety.quantityPerCell;
  if (harvestingPlanItem.quantity < 0) {
    harvestingPlanItem.quantity = 0; // Ensure quantity doesn't go negative
  }
  await harvestingPlanItem.save();
  await harvestingPlan.save();

  for (const pcv of plantedCropVarieties) {
    pcv.plantingPlanItem = null;
    pcv.harvestedAt = new Date();
    pcv.harvestingPlanItem = harvestingPlanItem._id;
    await pcv.save();
  }

  await harvestingPlan.harvestingBatch.addPlantedCropVarieties({
    plantedCropVarietiesIds: plantedCropVarieties.map((pcv) => pcv._id),
    cropVarietyId,
    quantityPerCell: harvestingPlanItem.cropVariety.quantityPerCell,
  });

  return plantedCropVarieties;
}
