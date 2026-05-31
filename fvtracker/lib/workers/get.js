import {
  CULTIVATION_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "../constants/users/managerTypes.js";
import { Worker } from "@/models/user/workers";
import populateCommon, {
  cultivationPopulate,
  productionPopulate,
  warehousePopulate,
} from "./populate";

export const getWorkers = async ({ rootManagerId, managerModelName }) => {
  const workers = await Worker.find({
    manager: rootManagerId,
  }).populate(populateCommon);

  console.log({ rootManagerId, managerModelName });
  console.log("Fetched workers for rootManagerId:", { workers });

  for (const worker of workers) {
    switch (managerModelName) {
      case CULTIVATION_MANAGER:
        console.log("Populating cultivation work for worker:", worker);
        // find cult worker and populate
        for (const worker of workers) {
          await worker.populate(cultivationPopulate);
        }
        break;
      case PRODUCTION_MANAGER:
        console.log("Populating production work for worker:", worker);
        for (const worker of workers) {
          await worker.populate(productionPopulate);
        }
        break;
      case WAREHOUSE_MANAGER:
        console.log("Populating warehouse work for worker:", worker);
        for (const worker of workers) {
          await worker.populate(warehousePopulate);
        }
        break;
      default:
        return workers;
    }
  }
  console.log({ workers });
  return workers;
};
