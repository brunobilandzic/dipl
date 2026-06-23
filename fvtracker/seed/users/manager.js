import { RootManager } from "@/models/user/managers/RootManager.js";
import dbConnect from "@/lib/db/mongooseConnect";
import mongoose from "mongoose";
import { AppUser } from "@/models/user/AppUser";
import { Procurment, ProcurmentItem } from "@/models/documents/Procurment";
import { procurments } from "../data/procurments";
import { RoleRequest } from "@/models/documents/requests/RoleRequest";
import { ROLE_STATUSES } from "@/lib/constants/users";

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
  return { rootManager, specificManager };
};

const createRootManager = async (
  appUserId,
  managerModelName,
  generalManagerId,
) => {
  const rootManager = new RootManager({
    appUser: appUserId,
    managerModelName,
    generalManager: generalManagerId,
  });

  const appUser = await AppUser.findById(appUserId);
  appUser.manager = rootManager._id;

  const procurment = new Procurment({
    name: `Nabavka for ${managerModelName}`,
    description: `Opis nabavke za ${managerModelName}`,
    manager: rootManager._id,
    items: procurments[managerModelName],
    status: Math.random() < 0.6 ? "na čekanju" : "odobrena",
  });

  await procurment.save();
  await appUser.save();
  await rootManager.save();
  await RoleRequest.findByIdAndUpdate(rootManager.roleRequest, {
    status: ROLE_STATUSES.APPROVED,
  });
  return rootManager;
};

const crateSpecificManager = async (
  appUserId,
  managerModelName,
  rootManagerId,
) => {
  const specificManager = new mongoose.models[managerModelName]({
    appUser: appUserId,
    rootManager: rootManagerId,
  });
  await specificManager.save();
  return specificManager;
};
