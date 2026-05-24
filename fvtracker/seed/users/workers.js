import { AppUser } from "@/models/user/AppUser";
import { workersJson } from "../data/appUsers";
import { CultivationWorker } from "@/models/user/workers/CultivationWork";

export const seedWorkers = async () => {
  for (const workerData of workersJson) {
    const appUser = new AppUser(workerData);
    await appUser.save();
    console.log(`Seeded worker: ${appUser.username}`);

    switch (workerData.modelName) {
      case "CultivationWorker":
        const cultivationWorker = new CultivationWorker({
          appUser: appUser._id,
        });
        await cultivationWorker.save();
        console.log(`Created CultivationWorker for ${appUser.username}`);
        break;
    }
  }
};
