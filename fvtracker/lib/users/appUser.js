import dbConnect from "@/lib/db/mongooseConnect";
import { AppUser } from "@/models/user/AppUser";

export const getByUsername = async (username) => {
  await dbConnect();
  const appUser = await AppUser.findOne({ username });
  if (!appUser) {
    throw new Error(`AppUser with username ${username} not found`);
  }
  return appUser;
};
