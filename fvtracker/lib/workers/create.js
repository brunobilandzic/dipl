import { AppUser } from "@/models/user/AppUser";
import {
  CULTIVATION_MANAGER,
  FINANCIAL_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "../constants/users/managerTypes";
import mongoose from "mongoose";
import populateCommon, {
  cultivationPopulate,
  productionPopulate,
  warehousePopulate,
  financialPopulate,
} from "./populate";
import { EMPLOYMENT_STATUS_EMPLOYED } from "../constants/users/workers";
import bcrypt from "bcrypt";

export const createWorker = async ({
  workerData,
  rootManagerId,
  isGeneralAdmin,
}) => {
  const { hourlyRate, password, ...workerAppUserData } = workerData;
  const appUser = new AppUser({
    ...workerAppUserData,
    provider: "credentials",
    password: await bcrypt.hash(password, 10),
  });
  await appUser.save();
  if (!rootManagerId) {
    throw new Error("Nije pronađen root manager za kreiranje radnika");
  }
  let specificWorker;

  switch (workerData.managerModelName) {
    case CULTIVATION_MANAGER:
      const CultivationWorker = mongoose.models["CultivationWorker"];
      specificWorker = new CultivationWorker({
        appUser: appUser._id,
        manager: rootManagerId,
        hourlyRate,
      });
      await specificWorker.save();

      await specificWorker.populate(cultivationPopulate);
      break;
    case PRODUCTION_MANAGER:
      const ProductionWorker = mongoose.models["ProductionWorker"];
      specificWorker = new ProductionWorker({
        appUser: appUser._id,
        manager: rootManagerId,
        hourlyRate,
      });
      await specificWorker.save();
      await specificWorker.populate(productionPopulate);
      break;
    case WAREHOUSE_MANAGER:
      const WarehouseWorker = mongoose.models["WarehouseWorker"];
      specificWorker = new WarehouseWorker({
        appUser: appUser._id,
        manager: rootManagerId,
        hourlyRate,
      });

      await specificWorker.save();
      await specificWorker.populate(warehousePopulate);
      break;
    case FINANCIAL_MANAGER:
      const FinancialWorker = mongoose.models["FinancialWorker"];
      specificWorker = new FinancialWorker({
        appUser: appUser._id,
        manager: rootManagerId,
        hourlyRate,
      });

      await specificWorker.save();
      await specificWorker.populate(financialPopulate);
      break;
    default:
      throw new Error(
        `Nepoznat rootmanager root: ${rootManagerId} za sektor: ${workerData.managerModelName}`,
      );
  }

  if (!specificWorker) {
    throw new Error(
      "Kreiranje radnika nije uspjelo, specificWorker nije definiran",
    );
  }

  if (isGeneralAdmin) {
    const employmentRequest = await mongoose.models.EmploymentRequest.findOne({
      worker: specificWorker._id,
    });
    if (!employmentRequest) {
      throw new Error(
        `Nije pronađen zahtjev za zapošljavanje radnika ${specificWorker._id} nakon kreiranja radnika`,
      );
    }
    employmentRequest.status = EMPLOYMENT_STATUS_EMPLOYED;
    await employmentRequest.save();
  }

  await specificWorker.populate(populateCommon);

  return {
    specificWorker,
  };
};
