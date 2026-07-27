import { AppUser } from "@/models/user/AppUser";
import { workersJson } from "../data/appUsers";
import { CultivationWorker } from "@/models/user/workers/CultivationWork";
import { CultivationManager } from "@/models/user/managers/CultivationManager";
import { ProductionWorker } from "@/models/user/workers/ProductionWork";
import { ProductionManager } from "@/models/user/managers/ProductionManager";
import dbConnect from "@/lib/db/mongooseConnect";
import { Worker } from "@/models/user/workers";
import { WarehouseManager } from "@/models/user/managers/WarehouseManager";
import { WarehouseWorker } from "@/models/user/workers/WarehouseWork";
import { FinancialWorker } from "@/models/user/workers/FinancialWork";
import { FinancialManager } from "@/models/user/managers/FinancialManager";
import { EmploymentRequest } from "@/models/user/workers/EmploymentRequest";

export const seedWorkers = async () => {
  await dbConnect();
  await Worker.deleteMany({});
  for (const workerData of workersJson) {
    const appUser = new AppUser(workerData);
    await appUser.save();
    let employmentRequest;
    switch (workerData.modelName) {
      case "CultivationWorker":
        const cultivationManager = await CultivationManager.findOne();
        const cultivationWorker = new CultivationWorker({
          appUser: appUser._id,
          manager: cultivationManager.rootManager,
          hourlyRate: workerData.hourlyRate,
        });
        await cultivationWorker.save();
        employmentRequest = await EmploymentRequest.findOne({
          worker: cultivationWorker._id,
        });
        break;
      case "ProductionWorker":
        const productionManager = await ProductionManager.findOne();
        const productionWorker = new ProductionWorker({
          appUser: appUser._id,
          manager: productionManager.rootManager,
          hourlyRate: workerData.hourlyRate,
        });
        await productionWorker.save();
        employmentRequest = await EmploymentRequest.findOne({
          worker: productionWorker._id,
        });
        break;
      case "WarehouseWorker":
        const warehouseManager = await WarehouseManager.findOne();
        const warehouseWorker = new WarehouseWorker({
          appUser: appUser._id,
          manager: warehouseManager.rootManager,
          hourlyRate: workerData.hourlyRate,
        });
        await warehouseWorker.save();
        employmentRequest = await EmploymentRequest.findOne({
          worker: warehouseWorker._id,
        });
        break;
      case "FinancialWorker":
        const financialManager = await FinancialManager.findOne();
        const financialWorker = new FinancialWorker({
          appUser: appUser._id,
          manager: financialManager.rootManager,
          hourlyRate: workerData.hourlyRate,
        });
        await financialWorker.save();
        employmentRequest = await EmploymentRequest.findOne({
          worker: financialWorker._id,
        });
        break;
      default:
        console.warn(
          `Unknown worker type ${workerData.modelName} for user ${appUser.username}`,
        );
    }
    employmentRequest.status = workerData.employmentRequestStatus;

    await employmentRequest.save();
  }
  console.log(`seeded ${workersJson.length} workers`);
};
