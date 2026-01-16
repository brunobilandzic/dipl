import dbConnect from "@/lib/db/mongooseConnect";
import { AppUser } from "@/models/user/AppUser";

export async function handleEmail(email) {
  await dbConnect();
  const appUser = AppUser.findOne({ email });
  if (appUser) {
    return true;
  } else {
    const newUser = new AppUser({ email });
    await newUser.save();
    return true;
  }
}
