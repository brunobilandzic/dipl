// CULTIVATION MANAGER IS GETTING HARVESTING BATCHES THROUGH FIELDS, PRODUCTION MANAGER USES THIS FILE

import { fetchSessionSpecificManager } from "@/lib/auth/fetchSessionData";
import {
  CULTIVATION_MANAGER,
  PRODUCTION_MANAGER,
} from "@/lib/constants/users/managerTypes";
import { HarvestingBatch } from "@/models/sectors/interface/HarvestingBatch";
import { populateConfigCropVariety } from "../populate";

export async function getHarvestingBatches({
  managerName = PRODUCTION_MANAGER,
  batchIds,
} = {}) {
  switch (managerName) {
    case CULTIVATION_MANAGER:
      return await cmBatches({ batchIds });
    case PRODUCTION_MANAGER:
      return await pmBatches({ batchIds });
  }
}

export async function findBatchByName({ name }) {
  const harvestingBatch = await HarvestingBatch.findOne({
    name,
  });

  if (!harvestingBatch)
    throw new Error(`Harvesting batch with name ${name} not found.`);

  return harvestingBatch;
}

async function cmBatches({ batchIds }) {
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
        populate: {
          path: "harvestingBatchItems",
          select: "cropVariety plantedCropVarieties quality batchQuantity",
          populate: {
            path: "cropVariety",
            populate: populateConfigCropVariety,
          },
        },
      },
    },
  });
  const harvestingBatches = await populateBatches({ harvestingBatches });
}

async function pmBatches({ batchIds }) {
  /*   await fetchSessionSpecificManager({
    managerName: PRODUCTION_MANAGER,
  }); */
  const filter = batchIds ? { _id: { $in: batchIds } } : {};
  const batches = await HarvestingBatch.find(filter).populate([
    {
      path: "harvestingBatchItems",
      populate: [
        {
          path: "cropVariety",
          populate: populateConfigCropVariety,
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
        select: "cropVariety plantedCropVarieties quality batchQuantity",
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
