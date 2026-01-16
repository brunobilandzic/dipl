import dbConnect from "@/lib/db/mongooseConnect";
import { AppUser } from "@/models/user/AppUser";
import bcrypt from "bcrypt";

export async function handleOAuth(email) {
  console.log("Handling OAuth for email:", email);
  await dbConnect();
  const appUser = await AppUser.findOne({ email });
  if (appUser) {
    if (!appUser.infoFilled) {
      console.log("User info not filled, redirecting to complete profile.");
      return { authorize: false, redirectTo: "/auth/complete-profile" };
    }
    return { authorize: true };
  } else {
    const newUser = new AppUser({ email });
    await newUser.save();
    return { authorize: true };
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
  }
  return { email: 2 };
}
