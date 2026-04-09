import { HarvestingPlan } from "@/models/documents/plans/HarvestingPlan";
import { getCultivationById } from "./cultivation";
import { PlantedCropVariety } from "@/models/sectors/cultivation/Crops";
import {
  CULTIVATION_MANAGER,
  PRODUCTION_MANAGER,
} from "../constants/users/managerTypes";
import { HarvestingBatch } from "@/models/sectors/interface/HarvestingBatch";
import { fetchSessionSpecificManager } from "../auth/fetchSessionData";

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

export async function getHarvestingBatches({
  managerName = CULTIVATION_MANAGER,
}) {
  switch (managerName) {
    case CULTIVATION_MANAGER:
      return await cmBatches();
    case PRODUCTION_MANAGER:
      return await pmBatches();
  }
}

async function cmBatches() {
  const cultivationManager = await fetchSessionSpecificManager({
    managerName: "cultivationManager",
  });

  await cultivationManager.populate({
    path: "fields",
    select: "harvestingPlans",
    populate: {
      path: "harvestingPlans",
      select: "harvestingBatch",
      populate: {
        path: "harvestingBatch",
        select: "harvestingBatchItems productions",
      },
    },
  });
  console.log({ harvestingBatches });
  const harvestingBatches = await populateBatches({ harvestingBatches });
  console.log({
    harvestingBatches,
  });
}

async function pmBatches() {
  await fetchSessionSpecificManager({
    managerName: PRODUCTION_MANAGER,
  });
  const batches = await HarvestingBatch.find({}).populate([
    {
      path: "harvestingBatchItems",
      populate: [
        {
          path: "cropVariety",
          select: "name cropType plantedCropVarieties",
          populate: [
            {
              path: "cropType",
              select: "name",
            },
          ],
        },
      ],
    },
  ]);
  return batches;
}

export function populateBatches({ harvestingBatches }) {
  return harvestingBatches.populate([
    {
      path: "harvestingBatchItems",
      populate: {
        select: "cropVariety plantedCropVarieties",
        populate: [
          {
            path: "cropVariety",
            select: "name cropType",
            populate: {
              path: "cropType",
              select: "name generalType",
              populate: {
                path: "generalType",
                select: "name mainCropType",
                populate: {
                  path: "mainCropType",
                  select: "name",
                },
              },
            },
          },
          {
            path: "plantedCropVarieties",
            select: "cultivation fieldCoords",
            populate: {
              path: "cultivation",
              select: "name cultivationArea",
              populate: {
                path: "cultivationArea",
                select: "name field",
                populate: {
                  path: "field",
                  select: "name",
                },
              },
            },
          },
        ],
      },
    },
    {
      path: "productions",
    },
  ]);
}
