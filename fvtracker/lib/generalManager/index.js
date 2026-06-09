import mongoose from "mongoose";
import {
  fetchAdmin,
  fetchSessionSpecificManager,
} from "../auth/fetchSessionData";
import { GeneralManager } from "@/models/user/managers/GeneralManager";

export const getGeneralManager = async () => {
  let generalManagerDoc;
  const { admin } = await fetchAdmin();
  if (admin) {
    generalManagerDoc = await GeneralManager.findOne()
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
        populate: [
          {
            path: "appUser",
            select: "name lastname username email",
          },
        ],
      },
    },
    {
      path: "managers",
      populate: [
        {
          path: "appUser",
          select: "name lastname username email",
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
  console.log("Final General Manager data to be returned:", generalManager);
  return generalManager;
};
