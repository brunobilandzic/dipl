import models from "@/models";
import { fetchSessionAppUser } from "@/lib/auth/fetchSessionData";
import { unstable_cache } from "next/cache";

export async function getCultivationManager() {
   const appUser = await fetchSessionAppUser();
      if (!appUser) {
        throw new Error("No app user found for the session.");
      }
  const cacheFunction = unstable_cache(
    async () => {
     console.log("[CM] CACHE MISS -> doing DB query");
      const cultivationManager =
        await appUser.getSpecificManager("CultivationManager");
      if (!cultivationManager) {
        return <div>No cultivation manager found for this user.</div>;
      }
      await cultivationManager.populate({
        path: "fields",
        populate: {
          path: "cultivationAreas",
        },
      });

      return cultivationManager;
    },
    ["CultivationManager"],
    { tags: ["cm"] },
  );
  return await cacheFunction();
}
