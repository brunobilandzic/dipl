import { AppUser } from "@/models/user/AppUser";
import { workersJson } from "../data/appUsers";
import { CultivationWorker } from "@/models/user/workers/CultivationWork";
import { CultivationManager } from "@/models/user/managers/CultivationManager";

export const seedWorkers = async () => {
  for (const workerData of workersJson) {
    const appUser = new AppUser(workerData);
    await appUser.save();
    console.log(`Seeded worker: ${appUser.username}`);

    switch (workerData.modelName) {
      case "CultivationWorker":
        const cultivationManager = await CultivationManager.findOne();
        const cultivationWorker = new CultivationWorker({
          appUser: appUser._id,
          manager: cultivationManager.rootManager,
        });
        await cultivationWorker.save();
        console.log(`Created CultivationWorker for ${appUser.username}`);
        break;
    }
  }
};
