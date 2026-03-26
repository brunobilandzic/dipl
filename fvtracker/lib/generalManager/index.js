import { fetchSessionSpecificManager } from "../auth/fetchSessionData";

export const getGeneralManager = async () => {
  const generalManager = await fetchSessionSpecificManager({
    managerName: "GeneralManager",
    throwError: true,
  });
  await generalManager.populate([
    {
      path: "roleRequests",
      populate: {
        path: "rootManager",
        populate: [
          {
            path: "appUser",
          },
        ],
      },
    },
  ]);
  
  return generalManager;
};
