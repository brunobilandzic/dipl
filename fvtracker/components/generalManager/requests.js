"use client";

import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";

export const RoleRequestList = () => {
  const generalManager = useSelector((state) => state.generalManager.manager);

  return (
    <div>
      <div>{JSON.stringify(generalManager.roleRequests, null, 2)}</div>
      <div className="text-2xl font-bold">Zahtjevi za uloge</div>
      <div className="flex flex-col gap-4 ">
        {generalManager.roleRequests.map((roleRequest) => (
          <div key={roleRequest.id}>
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
      <Link href={`/menadzeri/zahtjevi/${roleRequest._id}`}>
        <div className="p-4 border rounded-md shadow-md flex flex-col gap-2 relative">
          <div>
            {name} {surname}
          </div>
          <div>Zahtjev za ulogu: {requestedRoleName}</div>
        </div>
      </Link>
    </>
  );
};
