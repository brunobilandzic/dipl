import { populateConfigCropVariety } from "../cultivation/populate";

export const harvestWorkPopulate = [
  {
    path: "harvestingBatchItem",
    populate: [
      { path: "cropVariety", populate: populateConfigCropVariety },
      { path: "harvestingBatch", select: "name" },
    ],
  },
];

export const plantageWorkPopulate = [
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
];
