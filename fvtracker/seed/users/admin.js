import users from "@/lib/constants/users";
import { Admin } from "@/models/user/Admin";
import dbConnect from "@/lib/db/mongooseConnect";
import appUsersJsonArray from "../data/appUsers";
import { AppUser } from "@/models/user/AppUser";

const check = async () => {
  await dbConnect();
  const adminCount = await Admin.countDocuments();
  if (adminCount > 0) {
    await Admin.deleteOne({ username: users.roles.ADMIN.username });
    console.log(`Deleted existing admin user`);
  }
};

export const createAdmin = async () => {
  await check();

  const adminData = appUsersJsonArray.find((user) => user.username === "admin");

  const adminAppUser = new AppUser(adminData);
  await adminAppUser.save();

  const admin = new Admin({
    appUser: adminAppUser._id,
  });
  await admin.save();

  return admin;
};
