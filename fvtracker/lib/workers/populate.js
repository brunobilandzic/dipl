import { populateConfigCropVariety } from "../cultivation/populate";

export default [
  {
    path: "appUser",
  },
  {
    path: "harvestWorks",
    populate: [
      {
        path: "harvestingBatchItem",
        populate: { path: "cropVariety", populate: populateConfigCropVariety },
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
      ],
    },
  },
];
