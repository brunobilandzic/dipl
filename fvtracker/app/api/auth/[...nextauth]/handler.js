import dbConnect from "@/lib/db/mongooseConnect";
import { AppUser } from "@/models/user/AppUser";
import bcrypt from "bcrypt";

export async function handleOAuth(email) {
  await dbConnect();
  const appUser = await AppUser.findOne({ email });
  if (appUser) {
    return true;
  } else {
    const newUser = new AppUser({ email });
    await newUser.save();
    return true;
  }
}

export async function authorizeCredentials({ email, password }) {
  // compare passwords, otherwise rturn null
  await dbConnect();
  const appUser = await AppUser.findOne({ email });

  if (appUser) {
    const authorized = await bcrypt.compare(password, appUser.password);

    if (authorized) {
      return appUser;
    } else {
      return null;
    }
  }
  return null;
}
