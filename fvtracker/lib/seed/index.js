"use server";
import seedAppUsers from "./users/appUsers";

export async function seedDocuments(seedType) {
  console.log(`Seeding documents of type: ${seedType}`);
  switch (seedType) {
    case "Seed App Users":
      const appUsers = await seedAppUsers();
      console.log("App Users seeded:", appUsers?.length);
      return  appUsers ;
    default:
      throw new Error(`Unknown seed type: ${seedType}`);
  }
}
