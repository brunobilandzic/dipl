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
