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
import mongoose from "mongoose";
import { EMPLOYMENT_STATUS_EMPLOYED } from "../constants/users/workers.js";

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
        console.log("Populating cultivation work for worker:", worker._id);
        for (const worker of workers) {
          await worker.populate(cultivationPopulate);
        }
        break;
      case PRODUCTION_MANAGER:
        console.log("Populating production work for worker:", worker._id);
        for (const worker of workers) {
          await worker.populate(productionPopulate);
        }
        break;
      case WAREHOUSE_MANAGER:
        console.log("Populating warehouse work for worker:", worker._id);
        for (const worker of workers) {
          await worker.populate(warehousePopulate);
        }
        break;
      case FINANCIAL_MANAGER:
        for (const worker of workers) {
          if (worker.manager.managerModelName === FINANCIAL_MANAGER) {
            console.log("Populating financial work for worker:", worker._id);
            await worker.populate(financialPopulate);
          } else {
          }
        }
      case GENERAL_MANAGER || FINANCIAL_MANAGER:
        console.log("\nPopulating general work for worker:\n", worker._id);
        for (const worker of workers) {
          switch (worker.manager.managerModelName) {
            case CULTIVATION_MANAGER:
              await worker.populate(cultivationPopulate);
              break;
            case PRODUCTION_MANAGER:
              await worker.populate(productionPopulate);
              break;
            case WAREHOUSE_MANAGER:
              await worker.populate(warehousePopulate);
              break;
            case FINANCIAL_MANAGER:
              await worker.populate(financialPopulate);
              break;
            default:
              break;
          }
        }
      default:
        return workers;
    }
  }

  return workers;
};

export const getEmployedWorker = async (workerModelName) => {
  const workers = await mongoose.models[workerModelName]
    .find()
    .populate({ path: "employmentRequest", select: "status" });
  const employedWorker = workers.find(
    (worker) => worker.employmentRequest?.status === EMPLOYMENT_STATUS_EMPLOYED,
  );
  if (!employedWorker) {
    throw new Error(`No employed worker found for model: ${workerModelName}`);
  }
  return employedWorker;
};
