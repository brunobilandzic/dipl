"use server";
import { SEED_ERROR } from "@/lib/constants/errors/db/seed";
import appUsersJsonArray from "@/lib/seed/data/appUsers";
import { AppUser } from "@/models/user/AppUser";

export default async function seedAppUsers() {
  console.log("Seeding appUsers...");

  if (!appUsersJsonArray) {
    console.log("No appUsers to seed.");
    throw new Error(SEED_ERROR, "AppUsers data is undefined");
  }

  const promiese = [];
  for (const appUserData of appUsersJsonArray) {
    promiese.push(createAppUser(appUserData));
  }
  const appUsers = await Promise.all(promiese);

  if (!appUsers || appUsers.length === 0) {
    console.log("No appUsers were created.");
    throw new Error(SEED_ERROR, "No AppUsers were created");
  }

  return appUsers;
}

const createAppUser = async (appUserData) => {
  const appUser = new AppUser(appUserData);
  await appUser.save();
  return appUser;
};
