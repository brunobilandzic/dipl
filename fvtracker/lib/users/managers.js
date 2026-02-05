import Managers from "@/models/user/managers";
const { Manager } = Managers;
import dbConnect from "@/lib/db/mongooseConnect";
import mongoose from "mongoose";

export async function fetchManager(rootManagerId) {
  if (!rootManagerId) {
    console.log("No root manager ID provided to fetchManager");
    return null;
  }

  const manager = await Manager.findById(rootManagerId);
  if (!manager) {
    console.log("Manager not found for ", rootManagerId);
    return null;
  }

  const managerModelName = manager.managerModelName;

  const specificManager = await mongoose.models[managerModelName].findOne({
    manager: manager._id,
  });

  return { manager, specificManager };
}
