"use server";
import { SEED_ERROR } from "@/lib/constants/errors/db/seed";
import appUsersJsonArray from "@/seed/data/appUsers";
import { AppUser } from "@/models/user/AppUser";
import dbConnect from "@/lib/db/mongooseConnect";
import { Admin } from "@/models/user/Admin";
import { GeneralManager } from "@/models/user/managers/GeneralManager";
import { CultivationManager } from "@/models/user/managers/CultivationManager";
import { ProductionManager } from "@/models/user/managers/ProductionManager";
import { WarehouseManager } from "@/models/user/managers/WarehouseManager";
import { FinancialManager } from "@/models/user/managers/FinancialManager";
import usersConstants from "@/lib/constants/users";
import { createGeneralManager } from "@/seed/users/generalManager";
import { createManager } from "@/seed/users/manager";
import { createAdmin } from "./admin";
import { Manager } from "@/models/user/managers/Manager";

const check = async () => {
  await dbConnect();

  await Manager.deleteMany({});
  await AppUser.deleteMany({});
  await Admin.deleteMany({});
  await GeneralManager.deleteMany({});
  await CultivationManager.deleteMany({});
  await ProductionManager.deleteMany({});
  await WarehouseManager.deleteMany({});
  await FinancialManager.deleteMany({});
  console.log("Deleted all users");
};

export default async () => {
  console.log("Seeding appUsers...");
  await check();

  // Create admin and general manager first
  const admin = await createAdmin();
  const generalManager = await createGeneralManager();

  // Now create other app users
  const promises = [];
  for (const appUserData of appUsersJsonArray) {
    if (!["general.manager", "admin"].includes(appUserData.username))
      promises.push(createAppUser(appUserData, generalManager._id));
  }

  const results = await Promise.all(promises);
  if (!results || results.length === 0) {
    console.log("No appUsers were created.");
    throw new Error(SEED_ERROR, "No AppUsers were created");
  }

  const managersIds = results
    .map((res) => res.managerId)
    .filter((id) => id !== null);

  GeneralManager.updateOne(
    { _id: generalManager._id },
    {
      $push: {
        managers: {
          $each: managersIds,
        },
      },
    },
  ).exec();

  console.log("General manager has", managersIds.length, "managers.");
  console.log(`Seeded ${results.length} appUsers.`);

  return {
    appUsersIds: results.map((res) => res.appUserId),
    managersIds: results.map((res) => res.managerId),
    adminId: admin._id,
    generalManagerId: generalManager._id,
  };
};

export const createAppUser = async (appUserData, generalManagerId) => {
  const appUser = new AppUser(appUserData);
  await appUser.save();
  const username = appUser.username;

  let manager = null;
  if (username in usersConstants.managersUsernameModel) {
    // now we have to crate a basic manager and specific manager
    const managerModelName = usersConstants.managersUsernameModel[username];
    manager = await createManager(
      appUser._id,
      managerModelName,
      generalManagerId,
    );
    if (!manager) {
      throw new Error(SEED_ERROR, `Manager not created for user ${username}`);
    }
    console.log(
      `Created manager role ${managerModelName} for user ${username}`,
    );
  }

  if (appUser)
    return { appUserId: appUser._id, managerId: manager?._id || null };
  throw new Error(SEED_ERROR, `AppUser creation failed for user ${username}`);
};

//create manager
