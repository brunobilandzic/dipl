import { Manager } from "@/models/user/managers/Manager.js";
import dbConnect from "@/lib/db/mongooseConnect";
import mongoose from "mongoose";
import { AppUser } from "@/models/user/AppUser";

export const createManager = async (
  appUserId,
  managerModelName,
  generalManagerId,
) => {
  if (!generalManagerId) {
    throw new Error(
      SEED_ERROR,
      "General Manager not found when creating manager",
    );
  }
  await dbConnect();
  const rootManager = await createRootManager(
    appUserId,
    managerModelName,
    generalManagerId,
  );
  const specificManager = await crateSpecificManager(
    appUserId,
    managerModelName,
    rootManager._id,
  );
  return specificManager;
};

const createRootManager = async (
  appUserId,
  managerModelName,
  generalManagerId,
) => {
  const rootManager = new Manager({
    appUser: appUserId,
    managerModelName,
    generalManager: generalManagerId,
  });
  console.log("app user id for manager creation:", appUserId);
  const appUser = await AppUser.findById(appUserId);
  console.log(`Creating root manager for app user ${appUser.username} with model ${managerModelName}`);
  appUser.manager = rootManager._id;
  
  await appUser.save();
  await rootManager.save();
  return rootManager;
};

const crateSpecificManager = async (
  appUserId,
  managerModelName,
  rootManagerId,
) => {
  const specificManager = new mongoose.models[managerModelName]({
    appUser: appUserId,
    manager: rootManagerId,
  });
  await specificManager.save();
  return specificManager;
};
