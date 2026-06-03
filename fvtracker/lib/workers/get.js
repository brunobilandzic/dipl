import {
  CULTIVATION_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
  FINANCIAL_MANAGER,
  GENERAL_MANAGER,
} from "../constants/users/managerTypes.js";
import { Worker } from "@/models/user/workers";
import populateCommon, {
  cultivationPopulate,
  productionPopulate,
  warehousePopulate,
  financialPopulate,
  generalPopulate,
} from "./populate";

export const getWorkers = async ({ rootManagerId, managerModelName }) => {
  let workers;
  if ([GENERAL_MANAGER, FINANCIAL_MANAGER].includes(managerModelName)) {
    workers = await Worker.find().populate(populateCommon);
  } else {
    workers = await Worker.find({
      manager: rootManagerId,
    }).populate(populateCommon);
  }

  for (const worker of workers) {
    switch (managerModelName) {
      case CULTIVATION_MANAGER:
        for (const worker of workers) {
          await worker.populate(cultivationPopulate);
        }
        break;
      case PRODUCTION_MANAGER:
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
      case FINANCIAL_MANAGER:
        console.log("Populating financial work for worker:", worker);
        for (const worker of workers) {
          if (worker.manager.managerModelName === FINANCIAL_MANAGER) {
            await worker.populate(financialPopulate);
          }
        }
        break;
      case GENERAL_MANAGER:
        console.log("Populating general work for worker:", worker);
        for (const worker of workers) {
          await worker.populate(generalPopulate);
        }
      default:
        return workers;
    }
  }

  return workers;
};
