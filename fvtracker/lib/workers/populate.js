import { populateConfigCropVariety } from "../cultivation/populate";

export default [
  {
    path: "appUser",
  },
  {
    path: "manager",
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

export const warehousePopulate = [
  {
    path: "shipmentItems",
    populate: [
      {
        path: "sources",
        populate: [
          {
            path: "product",
          },
        ],
      },
      {
        path: "shipment",
      },
    ],
  },
];

export const financialPopulate = [
  {
    path: "warehouseRequests",
  },
];
