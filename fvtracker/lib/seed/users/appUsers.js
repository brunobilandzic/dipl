"use server";
import { SEED_ERROR } from "@/lib/constants/errors/db/seed";
import appUsersJsonArray from "@/lib/seed/data/appUsers";
import { AppUser } from "@/models/user/AppUser";
import dbConnect from "@/lib/db/mongooseConnect";
import { Admin } from "@/models/user/roles/Admin";
import { GeneralManager } from "@/models/user/roles/GeneralManager";
import { CultivationManager } from "@/models/user/roles/CultivationManager";
import { ProductionManager } from "@/models/user/roles/ProductionManager";
import { StorageManager } from "@/models/user/roles/StorageManager";
import { FinancialManager } from "@/models/user/roles/FinancialManager";

const check = async () => {
  await dbConnect();
  const userCount = await AppUser.countDocuments();
  if (userCount > 0) {
    await AppUser.deleteMany({});
    await Admin.deleteMany({});
    await GeneralManager.deleteMany({});
    await CultivationManager.deleteMany({});
    await ProductionManager.deleteMany({});
    await StorageManager.deleteMany({});
    await FinancialManager.deleteMany({});
    console.log("Deleted all users");
  }
};

export const seed = async () => {
  console.log("Seeding appUsers...");
  await check();

  if (!appUsersJsonArray) {
    console.log("No appUsers to seed.");
    throw new Error(SEED_ERROR, "AppUsers data is undefined");
  }

  const promiese = [];
  for (const appUserData of appUsersJsonArray) {
    promiese.push(create(appUserData));
  }
  const appUsers = await Promise.all(promiese);

  if (!appUsers || appUsers.length === 0) {
    console.log("No appUsers were created.");
    throw new Error(SEED_ERROR, "No AppUsers were created");
  }

  return appUsers;
};

export const create = async (appUserData) => {
  const appUser = new AppUser(appUserData);
  await appUser.save();
  return appUser;
};
