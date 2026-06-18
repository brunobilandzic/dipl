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
} from "./populate";
import mongoose from "mongoose";
import { EMPLOYMENT_STATUS_EMPLOYED } from "../constants/users/workers.js";
import { fetchAdmin } from "../auth/fetchSessionData.js";

export const getWorkers = async ({ rootManagerId, managerModelName }) => {
  const { unauthorized: notAdmin } = await fetchAdmin();
  let workers;
  if (
    !notAdmin ||
    [GENERAL_MANAGER, FINANCIAL_MANAGER].includes(managerModelName)
  ) {
    console.log("Admin or General/Financial Manager fetching all workers");
    workers = await Worker.find().populate(populateCommon);
  } else {
    console.log(
      `Fetching workers for rootManagerId: ${rootManagerId} and managerModelName: ${managerModelName}`,
    );
    workers = await Worker.find({ manager: rootManagerId }).populate(
      populateCommon,
    );
  }

  if (
    !notAdmin ||
    [GENERAL_MANAGER, FINANCIAL_MANAGER].includes(managerModelName)
  ) {
    // Group workers by their manager type and populate in bulk
    const groups = {
      [CULTIVATION_MANAGER]: [],
      [PRODUCTION_MANAGER]: [],
      [WAREHOUSE_MANAGER]: [],
      [FINANCIAL_MANAGER]: [],
    };

    for (const worker of workers) {
      const type = worker.manager?.managerModelName;
      if (groups[type]) groups[type].push(worker);
    }

    await Promise.all([
      Worker.populate(groups[CULTIVATION_MANAGER], cultivationPopulate),
      Worker.populate(groups[PRODUCTION_MANAGER], productionPopulate),
      Worker.populate(groups[WAREHOUSE_MANAGER], warehousePopulate),
      Worker.populate(groups[FINANCIAL_MANAGER], financialPopulate),
    ]);
  } else {
    const populateMap = {
      [CULTIVATION_MANAGER]: cultivationPopulate,
      [PRODUCTION_MANAGER]: productionPopulate,
      [WAREHOUSE_MANAGER]: warehousePopulate,
      [FINANCIAL_MANAGER]: financialPopulate,
    };

    const config = populateMap[managerModelName];
    if (config) await Worker.populate(workers, config);
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
  console.log(`Found employed worker for ${workerModelName}:`, employedWorker);
  return employedWorker;
};
