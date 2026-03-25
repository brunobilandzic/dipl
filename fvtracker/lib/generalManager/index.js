import { GeneralManager } from "@/models/user/managers/GeneralManager";

export const getGeneralManager = async () => {
  const generalManager = await GeneralManager.findOne();
  await generalManager.populate({
    path: "roleRequests",
    populate: {
      path: "rootManager",
      populate: [
        {
          path: "appUser",
        },
      ],
    },
  });
  console.log("generalManager:", generalManager);

  return generalManager;
};

