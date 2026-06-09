"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Loading, LoadingFullScreen } from "../layout/loading";
import { v4 as uuid } from "uuid";
import { RoleRequestStatus } from "./managerRequests";

export const ManagerList = () => {
  const generalManager = useSelector((state) => state.generalManager?.manager);
  const isAdmin = useSelector((state) => state.user?.session?.isAdmin);
  useEffect(() => {
    console.log("General Manager:", generalManager);
    if (!generalManager && !isAdmin) {
      console.warn(
        "General Manager data is not available. This may indicate an issue with fetching the general manager data or that the user does not have the necessary permissions.",
      );
    }
  }, [generalManager, isAdmin]);

  if (!generalManager && !isAdmin) {
    return <LoadingFullScreen />;
  }

  return (
    <>
      <div className="space-y-4 mt-4">
        {generalManager?.managers.map((manager) => (
          <ManagerListItem key={uuid()} manager={manager} />
        ))}
      </div>
    </>
  );
};

const ManagerListItem = ({ manager }) => {
  if (!manager || !manager.appUser) {
    return <Loading />;
  }

  return (
    <>
      <div className="border rounded-lg p-4 flex justify-between items-center">
        <div>
          <div className="flex flex-col">
            <h3 className="font-bold">
              {manager.appUser.name} {manager.appUser.surname}
            </h3>
            <p className="text-sm text-gray-500">{manager.appUser.email}</p>
            <p className="text-sm text-gray-500">{manager.managerModelName}</p>
          </div>
        </div>
        <RoleRequestStatus roleRequest={manager.roleRequest} />
      </div>
    </>
  );
};

export const CultivationManagerStatistics = ({ cultivationManager }) => {
  return (
    <>
      <div>
        <div>Fields created: {cultivationManager.fields.length}</div>
      </div>
    </>
  );
};
