"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { setLoading } from "@/store/loading";

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
          <RoleRequestStatus roleRequest={roleRequest} />
        </div>
      </div>
    </>
  );
};

const RoleRequestStatus = ({ roleRequest }) => {
  const { status } = roleRequest;
  const [respondMenuOpen, setRespondMenuOpen] = useState(false);

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
    <div className="relative text-sm font-semibold">
      {!respondMenuOpen && (
        <span
          onClick={() => setRespondMenuOpen(true)}
          className={`text-white w-20 text-center px-2 py-2 rounded-lg ${statusBackground} relative ${statusColor} cursor-pointer`}
        >
          {status}
        </span>
      )}
      {respondMenuOpen && (
        <div className="">
          <RespondMenu
            roleRequest={roleRequest}
            setRespondMenuOpen={setRespondMenuOpen}
          />
        </div>
      )}
    </div>
  );
};

const RespondMenu = ({ roleRequest, setRespondMenuOpen }) => {
  const dispatch = useDispatch();

  const onRespond = async (response) => {
    try {
      dispatch(setLoading(true));
      await api.put(`/general-manager/role-requests/${roleRequest._id}`, {
        response,
      });
      setRespondMenuOpen(false);
    } catch (error) {
      console.error("Error responding to role request:", error);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        onClick={() => onRespond("approved")}
      >
        Odobri
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        onClick={() => onRespond("rejected")}
      >
        Odbij
      </button>
    </div>
  );
};
