export default [
  {
    path: "cultivationAreas",
    populate: [
      {
        path: "cultivations",
        populate: [
          {
            path: "plantedCropVarieties",
            populate: [
              {
                path: "plantingPlanItem",
                populate: {
                  path: "cropVariety",
                  populate: { path: "cropType" },
                },
              },
              {
                path: "harvestingPlanItem",
                populate: {
                  path: "cropVariety",
                  populate: { path: "cropType" },
                },
              },
              {
                path: "cultivation",
                select: "name cultivationArea",
                populate: {
                  path: "cultivationArea",
                  select: "name field",
                  populate: { path: "field", select: "name slug" },
                },
              },
            ],
          },
          { path: "harvestWorks" },
          { path: "plantageWorks" },
        ],
      },
      { path: "field", select: "slug" },
    ],
  },
  {
    path: "plantingPlans",
    populate: [
      {
        path: "items",
        populate: [
          { path: "cropVariety", populate: { path: "cropType" } },
          {
            path: "plantedCropVarieties",
            select: "-relativeCoords -fieldCoords",
            populate: [
              {
                path: "cultivation",
                select: "name cultivationArea",
                populate: {
                  path: "cultivationArea",
                  select: "name field",
                  populate: {
                    path: "field",
                    select: "name slug",
                  },
                },
              },
              {
                path: "plantingPlanItem",
                select: "cropVariety quantity",
                populate: {
                  path: "cropVariety",
                  select: "name cropType",
                  populate: { path: "cropType", select: "name" },
                },
              },
            ],
          },
        ],
      },
      {
        path: "field",
        select: "name slug",
      },
    ],
  },
  {
    path: "harvestingPlans",
    populate: [
      {
        path: "items",
        populate: [
          { path: "cropVariety", populate: { path: "cropType" } },
          {
            path: "plantedCropVarieties",
            select: "-relativeCoords -fieldCoords",
            populate: [
              {
                path: "cultivation",
                select: "name cultivationArea",
                populate: {
                  path: "cultivationArea",
                  select: "name field",
                  populate: {
                    path: "field",
                    select: "name slug",
                  },
                },
              },
              {
                path: "harvestingPlanItem",
                select: "cropVariety quantity",
                populate: {
                  path: "cropVariety",
                  select: "name cropType",
                  populate: { path: "cropType", select: "name" },
                },
              },
            ],
          },
        ],
      },
      {
        path: "field",
        select: "name slug",
      },
      {
        path: "harvestingBatch",
        select: "name harvestBatchItems productions harvestingPlan",
        populate: [
          {
            path: "harvestingBatchItems",
            select:
              "cropVariety plantedCropVarieties batchQuantity productionProcesses quality",
            populate: [
              {
                path: "cropVariety",
                select: "name cropType quantityPerCell",
                populate: {
                  path: "cropType",
                  select: "name generalType",
                  populate: {
                    path: "generalType",
                    select: "name mainCropType",
                    populate: { path: "mainCropType", select: "name" },
                  },
                },
              },
              {
                path: "plantedCropVarieties",
                populate: {
                  path: "plantingPlanItem",
                  select: "quantity",
                },
              },
              {
                path: "productionProcesses",
                select: "quantity comment productionsStock",
              },
            ],
          },
          {
            path: "harvestingPlan",
            select: "name",
          },
        ],
      },
    ],
  },
];
