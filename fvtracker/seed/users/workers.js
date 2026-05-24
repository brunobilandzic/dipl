import { workersManagersMap } from "@/lib/constants/users/workersManagersMap";
import { workersAppUsers } from "../data/appUsers";

export const seedWorkers = async () => {
  for(const appUserData of workersAppUsers) {
    const { appUserId } = await createAppUser(appUserData);
    console.log(`Created worker app user with id ${appUserId}`);
    const managerModelName = workersManagersMap[appUserData.username];
    if (!managerModelName) {
      console.warn(`No manager model found for username ${appUserData.username}, skipping worker creation.`);
      continue;
    }
    const rootManager = await mongoose.model("RootManager").findOne({ managerModelName });
  }
};
