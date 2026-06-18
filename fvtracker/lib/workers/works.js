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
