import usernames from "@/lib/constants/users/usernames";
import { Admin } from "@/models/user/roles/Admin";
import dbConnect from "@/lib/db/mongooseConnect";
import fetch from "@/lib/db/fetch";

const check = async () => {
  await dbConnect();
  const adminCount = await Admin.countDocuments();
  if (adminCount > 0) {
    const admin = await Admin.deleteOne({ username: usernames.ADMIN });
    console.log(`Deleted existing admin user`);
  }
};

export const create = async () => {
  console.log("Creating admin user...");
  await check();
  const appUser = await fetch.users.appUsers.getByUsername(usernames.ADMIN);
  const adminUser = new Admin({
    appUser: appUser._id,
  });
  await adminUser.save();
  return adminUser;
};
