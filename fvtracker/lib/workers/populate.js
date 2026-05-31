import { populateConfigCropVariety } from "../cultivation/populate";

export default [
  {
    path: "appUser",
  },
];

export const cultivationPopulate = [
  {
    path: "harvestWorks",
    populate: [
      {
        path: "harvestingBatchItem",
        populate: [
          { path: "cropVariety", populate: populateConfigCropVariety },
          { path: "harvestingBatch", select: "name" },
        ],
      },
    ],
  },
  {
    path: "plantageWorks",
    populate: {
      path: "plantage",
      select: "cultivation plantageItems",
      populate: [
        {
          path: "cultivation",
          select: "name",
        },
        {
          path: "plantageItems",
        },
      ],
    },
  },
];

export const productionPopulate = [
  {
    path: "productionProcesses",
    select: "quantity processedAt",
  },
  {
    path: "warehouseAcceptanceProcesses",
    select: "quantity acceptedAt",
  },
];
