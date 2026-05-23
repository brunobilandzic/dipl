import { AppUser } from "@/models/user/AppUser";
import dbConnect from "@/lib/db/mongooseConnect";
import appUsersJsonArray from "@/seed/data/appUsers";
import { GeneralManager } from "@/models/user/managers/GeneralManager";
import { RootManager } from "@/models/user/managers/RootManager";
import { GENERAL_MANAGER_USERNAME } from "@/lib/constants/users/managersUsernameModel";
import { GENERAL_MANAGER } from "@/lib/constants/users/managerTypes";
import { ROLE_STATUSES } from "@/lib/constants/users";
import { GeneralManagerRequest } from "@/models/documents/requests/RoleRequest";

export const createGeneralManager = async () => {
  await dbConnect();

  const generalManagerData = appUsersJsonArray.find(
    (user) => user.username === GENERAL_MANAGER_USERNAME,
  );

  const generalManagerAppUser = new AppUser(generalManagerData);
  await generalManagerAppUser.save();

  const generalManager = new GeneralManager({
    appUser: generalManagerAppUser._id,
  });
  await generalManager.save();
  const request = await GeneralManagerRequest.findOne();
  request.status = ROLE_STATUSES.APPROVED;
  await request.save();

  await generalManager.save();

  const rootManager = new RootManager({
    appUser: generalManagerAppUser._id,
    managerModelName: GENERAL_MANAGER,
    generalManager: generalManager._id,
  });
  await rootManager.save();
  generalManagerAppUser.rootManager = rootManager._id;
  await generalManagerAppUser.save();
  generalManager.rootManager = rootManager._id;
  await generalManager.save();

  return generalManager;
};
