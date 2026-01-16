import dbConnect from "@/lib/db/mongooseConnect";
import { AppUser } from "@/models/user/AppUser";
import bcrypt from "bcrypt";

export async function handleOAuth({email, given_name, family_name}) {
  await dbConnect();
  const appUser = await AppUser.findOne({ email });
  if (appUser) {
    return true;
  } else {
    const newUser = new AppUser({
      email,
      name: given_name,
      surname: family_name,
      provider: "google",
    });

    await newUser.save();
    return true;
  }
}

export async function authorizeCredentials({ email, password }) {
  // compare passwords, otherwise return null
  await dbConnect();
  const appUser = await AppUser.findOne({ email });

  if (appUser) {
    const authorized = await bcrypt.compare(password, appUser.password);
    if (authorized) {
      return appUser;
    } else {
      return null;
    }
  } else {
    const newUser = new AppUser({
      email,
      password: await bcrypt.hash(password, 10),
      provider: "credentials",
    });
    await newUser.save();
    return newUser;
  }
}
