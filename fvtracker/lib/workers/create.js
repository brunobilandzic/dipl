import { AppUser } from "@/models/user/AppUser";
import {
  CULTIVATION_MANAGER,
  PRODUCTION_MANAGER,
} from "../constants/users/managerTypes";
import mongoose from "mongoose";

export const createWorker = async ({ workerData, rootManager }) => {
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
      await specificWorker.populate("appUser");
      break;
    case PRODUCTION_MANAGER:
      const ProductionWorker = mongoose.models["ProductionWorker"];
      specificWorker = new ProductionWorker({
        appUser: appUser._id,
        manager: rootManager?._id,
        hourlyRate,
      });
      await specificWorker.save();
      await specificWorker.populate("appUser");
      break;
    case managerSectors[WAREHOUSE_MANAGER]:
      const WarehouseWorker = mongoose.models["WarehouseWorker"];
      specificWorker = new WarehouseWorker({
        appUser: appUser._id,
        manager: rootManager?._id,
        hourlyRate,
      });
      await specificWorker.save();
      await specificWorker.populate("appUser");
      break;
    case managerSectors[FINANCIAL_MANAGER]:
      const FinancialWorker = mongoose.models["FinancialWorker"];
      specificWorker = new FinancialWorker({
        appUser: appUser._id,
        manager: rootManager?._id,
        hourlyRate,
      });
      await specificWorker.save();
      await specificWorker.populate("appUser");
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
