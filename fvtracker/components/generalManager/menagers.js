"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { LoadingFullScreen } from "../layout/loading";
import { v4 as uuid } from "uuid";

export const ManagerList = () => {
  const generalManager = useSelector((state) => state.generalManager?.manager);

  useEffect(() => {
    console.log("General Manager:", generalManager);
    if (!generalManager)
      console.warn("General Manager data is not available in the Redux store.");
  }, [generalManager]);

  if (!generalManager) {
    return <LoadingFullScreen />;
  }

  return (
    <>
      {JSON.stringify(generalManager, null, 2)}
      <div className="space-y-4 mt-4">
        {generalManager.managers.map((manager) => (
          <ManagerListItem key={uuid()} manager={manager} />
        ))}
      </div>
      sssssss
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
        <div className="flex flex-col">
          <h3 className="font-bold"></h3>
          <p className="text-sm text-gray-500"></p>
        </div>
      </div>
    </>
  );
};
