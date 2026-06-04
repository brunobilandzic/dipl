import users from "@/lib/constants/users";
import { Admin } from "@/models/user/Admin";
import dbConnect from "@/lib/db/mongooseConnect";
import appUsersJsonArray from "../data/appUsers";
import { AppUser } from "@/models/user/AppUser";

const check = async () => {
  await dbConnect();
  const adminCount = await Admin.countDocuments();
  if (adminCount > 0) {
    await Admin.deleteMany();
    console.log(`Deleted existing admin user`);
  }
};

export const createAdmin = async () => {
  await check();

  console.log("Creating admin user...");
  const adminData = appUsersJsonArray.find((user) => user.username === "admin");
  const adminAppUser = new AppUser({ ...adminData, isAdmin: true });
  await adminAppUser.save();

  const admin = new Admin({
    appUser: adminAppUser._id,
  });
  await admin.save();

  return admin;
};
