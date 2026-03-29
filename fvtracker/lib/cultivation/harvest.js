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
    (pcv) =>
      pcv.plantingPlanItem?.cropVariety.toString() === cropVarietyId &&
      toHarvestCells.includes(pcv.relativeCoords),
  );

  const harvestingPlan = await getHarvestingPlanById(harvestingPlanId);
  await harvestingPlan.populate("items harvestingBatch");

  const harvestingPlanItem = harvestingPlan.items.find(
    (item) => item.cropVariety.toString() === cropVarietyId,
  );
  if (!harvestingPlanItem) {
    throw new Error(
      "Harvesting plan item not found for the given crop variety.",
    );
  }

  harvestingPlanItem.plantedCropVarieties.push(
    ...plantedCropVarieties.map((pcv) => pcv._id),
  );
  harvestingPlanItem.quantity -= plantedCropVarieties.length;
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

  const harvestBatchItem =
    await harvestingPlan.harvestingBatch.addPlantedCropVarieties({
      plantedCropVarietiesIds: plantedCropVarieties.map((pcv) => pcv._id),
      cropVarietyId,
    });

  return plantedCropVarieties;
}

export async function harvestingBatches() {
  const cultivationManager = await fetchSessionSpecificManager({
    managerName: "cultivationManager",
  });
}
