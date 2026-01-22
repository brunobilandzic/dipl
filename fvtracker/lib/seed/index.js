"use server";
import seedUsers from "@/lib/seed/users";

export async function seedDocuments(seedType) {
  console.log(`Seeding documents of type: ${seedType}`);
  switch (seedType) {
    case "Seed Users":
      const { appUsers, adminUserId } = await seedUsers.allUsers.seed();
      return { appUsers, adminUserId };
    default:
      throw new Error(`Unknown seed type: ${seedType}`);
  }
}
