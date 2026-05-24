import { workersManagersMap } from "@/lib/constants/users/workersManagersMap";
import { workersAppUsers } from "../data/appUsers";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";

export const seedWorkers = async () => {
  for (const appUserData of workersAppUsers) {
    const { appUserId } = await createAppUser(appUserData);
    console.log(`Created worker app user with id ${appUserId}`);
    const managerModelName = workersManagersMap[appUserData.username];
    if (!managerModelName) {
      console.warn(
        `No manager model found for username ${appUserData.username}, skipping worker creation.`,
      );
      continue;
    }
    const rootManager = await mongoose
      .model("RootManager")
      .findOne({ managerModelName });

    let worker;
    switch (managerModelName) {
      case CULTIVATION_MANAGER:
        worker = new CultivationWorker({
          appUser: appUserId,
        });
        await worker.save();
        console.log(
          `Created cultivation worker with id ${worker._id} for app user ${appUserId}`,
        );
        break;
    }
  }
};
