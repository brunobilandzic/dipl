import { MANAGER_TYPES } from "./managerTypes";

export const managerMorkerMap = MANAGER_TYPES.reduce((acc, managerType) => {
  const workerType = managerType.replace("Manager", "Worker");
  acc[managerType] = workerType;
  return acc;
}, {});
