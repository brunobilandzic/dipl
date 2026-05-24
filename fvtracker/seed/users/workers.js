import { workersManagersMap } from "@/lib/constants/users/workersManagersMap";
import { workersAppUsers } from "../data/appUsers";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";
import { createAppUser } from "./appUsers";
import dbConnect from "@/lib/db/mongooseConnect";
import { Worker } from "@/models/user/workers";
import mongoose from "mongoose";
import { CultivationWorker } from "@/models/user/workers/CultivationWorker";

export const seedWorkers = async () => {
  await dbConnect();
  await Worker.deleteMany({});
  const workers = [];
  for (const appUserData of workersAppUsers) {
    const { appUserId } = await createAppUser(appUserData);
    const appUser = await mongoose.models["AppUser"].findById(appUserId);
    console.log(`Created worker app user with id ${appUserId}`);
    const managerModelName = workersManagersMap[appUserData.username];
    if (!managerModelName) {
      console.warn(
        `No manager model found for username ${appUserData.username}, skipping worker creation.`,
      );
      continue;
    }
    const rootManager = await mongoose.models["RootManager"].findOne({
      managerModelName,
    });

    console.log({ rootManager });

    let worker;
    switch (managerModelName) {
      case CULTIVATION_MANAGER:
        worker = new CultivationWorker({
          appUser: appUserId,
          manager: rootManager._id,
        });
        appUser.worker = worker._id;
        await appUser.save();
        await worker.save();
        workers[managerModelName]
          ? workers[managerModelName].push(worker)
          : (workers[managerModelName] = [worker]);
        console.log(
          `Created cultivation worker with id ${worker._id} for app user ${appUserId}`,
        );
        break;
    }

    rootManager.workers.push(worker._id);
    await rootManager.save();
  }
  return workers;
};
