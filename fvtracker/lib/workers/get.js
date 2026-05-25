import Worker from "../models/Worker.js";

export const getWorkers = async ({ rootManagerId }) => {
  const workers = await Worker.find({
    rootManager: rootManagerId,
  }).populate("manager");

  return workers;
};
