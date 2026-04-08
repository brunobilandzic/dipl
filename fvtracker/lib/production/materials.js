import { HarvestingBatch } from "@/models/sectors/interface/HarvestingBatch";

export const getMaterials = async () => {
  const batches = await HarvestingBatch.find({});
  return batches;
};
