import { AppUser } from "@/models/user/AppUser";
import { workersJson } from "../data/appUsers";
import { CultivationWorker } from "@/models/user/workers/CultivationWork";
import { CultivationManager } from "@/models/user/managers/CultivationManager";
import dbConnect from "@/lib/db/mongooseConnect";
import { Worker } from "@/models/user/workers";

export const seedWorkers = async () => {
  await dbConnect();
  await Worker.deleteMany({});
  for (const workerData of workersJson) {
    const appUser = new AppUser(workerData);
    await appUser.save();

    switch (workerData.modelName) {
      case "CultivationWorker":
        const cultivationManager = await CultivationManager.findOne();
        const cultivationWorker = new CultivationWorker({
          appUser: appUser._id,
          manager: cultivationManager.rootManager,
          hourlyRate: workerData.hourlyRate,
        });
        await cultivationWorker.save();
        console.log(`Created CultivationWorker for ${appUser.username}`);
        break;
    }
  }
};
