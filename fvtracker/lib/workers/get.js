import { CULTIVATION_MANAGER } from "../constants/users/managerTypes.js";
import { Worker } from "@/models/user/workers";
import populateCommon, { cultivationPopulate } from "./populate";

export const getWorkers = async ({ rootManagerId, managerModelName }) => {
  const workers = await Worker.find({
    manager: rootManagerId,
  }).populate(populateCommon);

  console.log({ rootManagerId, managerModelName });
  console.log("Fetched workers for rootManagerId:", rootManagerId, { workers });

  for (const worker of workers) {
    switch (managerModelName) {
      case CULTIVATION_MANAGER:
        console.log("Populating cultivation work for worker:", worker);
        // find cult worker and populate
        for (const worker of workers) {
          await worker.populate(cultivationPopulate);
        }
      default:
        return workers;
    }
  }
  console.log({ workers });
  return workers;
};
