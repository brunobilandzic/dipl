import { CultivationWorker } from "@/models/user/workers/CultivationWorker";

export const getCultivationWorkerById = async (id) => {
  const cultivationWorker = await CultivationWorker.findById(id);
  if (!cultivationWorker) {
    throw new Error("Cultivation worker not found with the provided ID.");
  }
  return cultivationWorker;
};
