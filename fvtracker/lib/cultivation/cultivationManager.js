import models from "@/models";
import { fetchSessionAppUser } from "@/lib/auth/fetchSessionData";
import dbConnect from "../db/mongooseConnect";

export async function fetchCultivationManager() {
  await dbConnect();
   const appUser = await fetchSessionAppUser();
      if (!appUser) {
        throw new Error("No app user found for the session.");
      }
      const cultivationManager =
        await appUser.getSpecificManager("CultivationManager");
      if (!cultivationManager) {
        throw new Error("Cultivation Manager not found for the app user.");
      }
      
      await cultivationManager.populate({
        path: "fields",
        populate: {
          path: "cultivationAreas",
        },
      });

      return cultivationManager;

}
