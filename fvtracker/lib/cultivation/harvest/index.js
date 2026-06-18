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

  await harvestingPlan.harvestingBatch.addPlantedCropVarieties({
    harvestingPlanItem,
    plantedCropVarietiesIds: plantedCropVarieties.map((pcv) => pcv._id),
    cropVarietyId,
    quality,
    workerId,
    cultivationId,
    harvestedCoords: toHarvestCells,
  });

  return plantedCropVarieties;
}

export async function harvestCells_bup({
  cultivationId,
  cropVarietyId,
  toHarvestCells,
  harvestingPlanId,
  workerId,
  quality,
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
      select: "cropVariety quantity plantedCropVarieties harvestingBatch",
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
    quality,
  });

  const harvestWork = new HarvestWork({
    worker: workerId,
    cultivation: cultivationId,
    harvestingPlanItem: harvestingPlanItem._id,
    hoursWorked: plantedCropVarieties.length,
    harvestedCoords: toHarvestCells,
  });

  await harvestWork.save();

  return plantedCropVarieties;
}
