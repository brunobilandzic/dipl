import { RootManager } from "@/models/user/managers/RootManager";
import mongoose from "mongoose";
import models from "@/models";

export async function fetchManagerData(rootManagerId) {
  if (!rootManagerId) {
    console.log("No root manager ID provided to fetchManager");
    return null;
  }

  const rootManager = await RootManager.findById(rootManagerId);
  if (!rootManager) {
    console.log("Manager not found for ", rootManagerId);
    return null;
  }

  const managerModelName = rootManager.managerModelName;

  const specificManager = await mongoose.models[managerModelName].findOne({
    rootManager: rootManager._id,
  });

  return { rootManager, specificManager };
}
