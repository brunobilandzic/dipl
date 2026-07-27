// CULTIVATION MANAGER IS GETTING HARVESTING BATCHES THROUGH FIELDS, PRODUCTION MANAGER USES THIS FILE

import { fetchSessionSpecificManager } from "@/lib/auth/fetchSessionData";
import {
  CULTIVATION_MANAGER,
  GENERAL_MANAGER,
  PRODUCTION_MANAGER,
} from "@/lib/constants/users/managerTypes";
import { HarvestingBatch } from "@/models/sectors/interface/HarvestingBatch";
import { populateConfigCropVariety } from "../populate";

export async function getHarvestingBatches({
  managerName = PRODUCTION_MANAGER,
  batchIds,
} = {}) {
  switch (managerName) {
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

async function pmBatches({ batchIds }) {
  const filter = batchIds ? { _id: { $in: batchIds } } : {};
  const batches = await HarvestingBatch.find(filter)
    .select("harvestingBatchItems name productions")
    .populate([
      {
        path: "harvestingBatchItems",
        select: "cropVariety plantedCropVarieties quality batchQuantity",
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
