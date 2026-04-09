import { HarvestingBatch } from "@/models/sectors/interface/HarvestingBatch";

export const getHarvestingBatches= async () => {
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
};
