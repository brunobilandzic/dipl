import { AppUser } from "@/models/user/AppUser";
import { CULTIVATION_MANAGER } from "../constants/users/managerTypes";

export const createWorker = async ({ workerData, rootManager }) => {
  const { ...workerAppUserData } = workerData;
  const appUser = new AppUser(workerAppUserData);
  const worker = await mongoose.models[rootManager.managerModelName].create({
    appUser: appUser._id,
    manager: rootManager._id,
  });

  let specificWorker;

  switch (rootManager.managerModelName) {
    case CULTIVATION_MANAGER:
      const CultivationWorker = mongoose.models["CultivationWorker"];
      const specificWorker = new CultivationWorker({
        appUser: appUser._id,
        manager: rootManager._id,
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
