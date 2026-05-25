import { CULTIVATION_MANAGER } from "../constants/users/managerTypes.js";
import Worker from "../models/Worker.js";

export const getWorkers = async ({ rootManagerId, managerModelName }) => {
  const workers = await Worker.find({
    rootManager: rootManagerId,
  }).populate("manager");

  switch (managerModelName) {
    case CULTIVATION_MANAGER:
      await workers.populate([
        {
          path: "plantages",
        },
        {
          path: "harvests",
        },
      ]);
      return workers;
    default:
      return workers;
  }
};
