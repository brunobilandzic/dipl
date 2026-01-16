import dbConnect from "@/lib/db/mongooseConnect";
import { AppUser } from "@/models/user/AppUser";
import bcrypt from "bcrypt";

export async function handleOAuth(email, given_name, family_name) {
  console.log("Handling OAuth for email:", email);
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
  console.log("Authorizing credentials for email:", email);
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
