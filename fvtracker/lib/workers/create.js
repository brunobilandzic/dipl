import { AppUser } from "@/models/user/AppUser";
import { CULTIVATION_MANAGER } from "../constants/users/managerTypes";
import mongoose from "mongoose";

export const createWorker = async ({
  workerData,
  rootManager,
}) => {
  const { hourlyRate, ...workerAppUserData } = workerData;
  const appUser = new AppUser(workerAppUserData);
  await appUser.save();

  let specificWorker;

  switch (rootManager.managerModelName) {
    case CULTIVATION_MANAGER:
      const CultivationWorker = mongoose.models["CultivationWorker"];
      specificWorker = new CultivationWorker({
        appUser: appUser._id,
        manager: rootManager._id,
        hourlyRate,
      });
      await specificWorker.save();
      break;
    default:
      throw new Error(
        `Nepoznat tip menadžera: ${rootManager.managerModelName}`,
      );
  }

  return {
    specificWorker,
  };
};
