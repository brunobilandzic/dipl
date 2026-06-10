import mongoose from "mongoose";
import {
  fetchAdmin,
  fetchSessionSpecificManager,
} from "../auth/fetchSessionData";
import { GeneralManager } from "@/models/user/managers/GeneralManager";
import {
  CULTIVATION_MANAGER,
  FINANCIAL_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";

export const getGeneralManager = async () => {
  let generalManagerDoc;
  const { admin } = await fetchAdmin();
  if (admin) {
    generalManagerDoc = await GeneralManager.findOne();
  } else {
    generalManagerDoc = await fetchSessionSpecificManager({
      managerName: "GeneralManager",
      throwError: true,
    });
  }
  await generalManagerDoc.populate([
    {
      path: "roleRequests",
      populate: {
        path: "rootManager",
        select: "appUser",
        populate: [
          {
            path: "appUser",
            select: "name surname username email",
          },
        ],
      },
    },
    {
      path: "managers",
      populate: [
        {
          path: "appUser",
          select: "name surname username email",
        },
        {
          path: "roleRequest",
          select: "status",
        },
      ],
    },
  ]);

  const managers = [];

  for (const manager of generalManagerDoc.managers) {
    const specificManager = await mongoose.models[
      manager.managerModelName
    ].findOne({
      rootManager: manager._id,
    });
    managers.push({
      ...manager.toObject(),
      managerModelName: manager.managerModelName,
      specificManager: specificManager ? specificManager.toObject() : null,
    });
  }

  const generalManager = {
    ...generalManagerDoc.toObject(),
    managers,
  };

  return generalManager;
};

export const getSpecicManagers = async () => {
  const specificManagers = {
    [CULTIVATION_MANAGER]: null,
    [PRODUCTION_MANAGER]: null,
    [FINANCIAL_MANAGER]: null,
    [WAREHOUSE_MANAGER]: null,
  };

  for (const managerName of Object.keys(specificManagers)) {
    const manager = await mongoose.models[managerName].findOne();
    specificManagers[managerName] = manager;
  }

  return specificManagers;
};
