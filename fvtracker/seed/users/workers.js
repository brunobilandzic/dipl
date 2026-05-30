import { AppUser } from "@/models/user/AppUser";
import { workersJson } from "../data/appUsers";
import { CultivationWorker } from "@/models/user/workers/CultivationWork";
import { CultivationManager } from "@/models/user/managers/CultivationManager";
import { ProductionWorker } from "@/models/user/workers/ProductionWork";
import { ProductionManager } from "@/models/user/managers/ProductionManager";
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
      case "ProductionWorker":
        const productionManager = await ProductionManager.findOne();
        const productionWorker = new ProductionWorker({
          appUser: appUser._id,
          manager: productionManager.rootManager,
          hourlyRate: workerData.hourlyRate,
        });
        await productionWorker.save();
        console.log(`Created ProductionWorker for ${appUser.username}`);
        break;
      default:
        console.warn(
          `Unknown worker type ${workerData.modelName} for user ${appUser.username}`,
        );
    }
  }
};
