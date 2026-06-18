import { populateConfigCropVariety } from "../cultivation/populate";
import { harvestWorkPopulate } from "./works";

export default [
  {
    path: "appUser",
    select: "username email name surname",
  },
  {
    path: "manager",
    select: "managerModelName",
  },
  {
    path: "employmentRequest",
    select: "status updatedAt",
  },
];

export const cultivationPopulate = [
  {
    path: "harvestWorks",
    populate: harvestWorkPopulate,
  },
  {
    path: "plantageWorks",
    populate: [
      {
        path: "plantingPlanItem",
        select: "cropVariety",
        populate: [
          {
            path: "cropVariety",
            populate: populateConfigCropVariety,
          },
        ],
      },
    ],
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
    select: "shipment",
    populate: {
      path: "shipment",
      select: "shipmentItems",
      populate: [
        {
          path: "shipmentItems",
          select: "sources",
          populate: [
            {
              path: "sources",
            },
          ],
        },
      ],
    },
  },
  {
    path: "receipts",
  },
];

export const generalPopulate = [
  cultivationPopulate,
  productionPopulate,
  warehousePopulate,
  financialPopulate,
];
