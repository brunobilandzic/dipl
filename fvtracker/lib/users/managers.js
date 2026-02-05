import Managers from "@/models/user/managers";
const { Manager } = Managers;
import mongoose from "mongoose";

export async function fetchManager(rootManagerId) {
  if (!rootManagerId) {
    console.log("No root manager ID provided to fetchManager");
    return null;
  }

  const rootManager = await Manager.findById(rootManagerId);
  if (!rootManager) {
    console.log("Manager not found for ", rootManagerId);
    return null;
  }

  const managerModelName = rootManager.managerModelName;

  const specificManager = await mongoose.models[managerModelName].findOne({
    manager: rootManager._id,
  });

  return { rootManager, specificManager };
}
