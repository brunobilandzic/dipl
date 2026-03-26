"use client";

import React from "react";
import { useSelector } from "react-redux";

export const RoleRequestList = () => {
  const generalManager = useSelector((state) => state.generalManager.manager);

  return (
    <div>
      <div>{JSON.stringify(generalManager?.roleRequests, null, 2)}</div>
      <div className="text-2xl font-bold">Zahtjevi za uloge</div>
      <div className="flex flex-col gap-4 ">
        {generalManager.roleRequests.map((roleRequest) => (
          <div key={roleRequest._id}>
            <RoleRequestItem roleRequest={roleRequest} />
          </div>
        ))}
      </div>
    </div>
  );
};

const RoleRequestItem = ({ roleRequest }) => {
  const { name, surname } = roleRequest.rootManager.appUser;
  const { managerModelName: requestedRoleName } = roleRequest.rootManager;
  return (
    <>
      <div className="flex justify-between items-center mb-2 p-4 border rounded-md shadow-md">
        <div className="flex flex-col gap-2 ">
          <div>
            {name} {surname}
          </div>
          <div>Zahtjev za ulogu: {requestedRoleName}</div>
        </div>
        <div>
          <RoleRequestStatus status={roleRequest.status} />
        </div>
      </div>
    </>
  );
};

const RoleRequestStatus = ({ status }) => {
  let statusBackground = "bg-gray-500";
  let statusColor = "text-white";
  switch (status) {
    case "approved":
      statusBackground = "bg-green-500";
      break;
    case "rejected":
      statusBackground = "bg-red-500";
      break;
    case "pending":
      statusBackground = "bg-yellow-500";
      break;
    default:
      break;
  }
  return (
    <span
      className={`text-white w-20 text-center px-2 py-2 rounded-lg ${statusBackground} text-sm font-semibold ${statusColor}`}
    >
      {status}
    </span>
  );
};
