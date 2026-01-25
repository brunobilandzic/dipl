import { AppUser } from "@/models/user/AppUser";
import { GeneralManager } from "@/models/user/managers/GeneralManager.js";
import dbConnect from "@/lib/db/mongooseConnect";
import appUsersJsonArray from "@/seed/data/appUsers";
import { Manager } from "@/models/user/managers/Manager";

export const createGeneralManager = async () => {
  await dbConnect();

  const generalManagerData = appUsersJsonArray.find(
    (user) => user.username === "general.manager",
  );

  const generalManagerAppUser = new AppUser(generalManagerData);
  await generalManagerAppUser.save();

  const generalManager = new GeneralManager({
    appUser: generalManagerAppUser._id,
  });

  const basicManager = new Manager({
    appUser: generalManagerAppUser._id,
    managerModelName: "GeneralManager",
    generalManager: generalManager._id,
  });
  await basicManager.save();

  generalManager.manager = basicManager._id;
  await generalManager.save();

  return generalManager;
};
