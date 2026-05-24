import users from "@/lib/constants/users";
import { Admin } from "@/models/user/Admin";
import dbConnect from "@/lib/db/mongooseConnect";
import appUsersJsonArray from "../data/appUsers";
import { AppUser } from "@/models/user/AppUser";

const check = async () => {
  await dbConnect();
  const adminCount = await Admin.countDocuments();
  if (adminCount > 0) {
    await Admin.deleteOne();
    console.log(`Deleted existing admin user`);
  }
};

export const createAdmin = async () => {
  await check();

  const adminData = appUsersJsonArray.find((user) => user.username === "admin");
  console.log("Admin data found in JSON:", adminData);
  const adminAppUser = new AppUser({ ...adminData, isAdmin: true });
  await adminAppUser.save();

  console.log("Created admin AppUser:", adminAppUser);

  const admin = new Admin({
    appUser: adminAppUser._id,
  });
  await admin.save();

  return admin;
};
