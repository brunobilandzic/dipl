import { Machine } from "@/models/sectors/production/Machine";

export const getMachines = async () => {
  const machines = await Machine.find().populate("productionProcesses");
  if (!machines) {
    throw new Error("No machines found.");
  }
  return machines;
};
