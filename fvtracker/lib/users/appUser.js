import dbConnect from "@/lib/db/mongooseConnect";
import { AppUser } from "@/models/user/AppUser";

await dbConnect();

export async function getAppUser(filter) {
  const appUser = await AppUser.findOne(filter);
  if (!appUser) {
    throw new Error("App user not found");
  }
  return appUser;
}
