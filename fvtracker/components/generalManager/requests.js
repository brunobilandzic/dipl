"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { setLoading } from "@/store/loading";
import { AppSelect } from "../form/inputs";
import { ROLE_STATUSES } from "@/lib/constants/users";
import { requestResponseUpdate } from "@/store/generalManager";

export const RoleRequestList = () => {
  const generalManager = useSelector((state) => state.generalManager.manager);
  const [filter, setFilter] = useState("all");

  return (
    <div>
      <div className="flex justify-between items-center border-b-2 pb-4 pt-2">
        <div className="text-2xl font-bold">Zahtjevi za uloge</div>
        <FilterDropdown filter={filter} setFilter={setFilter} />
      </div>{" "}
      <div className="flex flex-col gap-4">
        {generalManager?.roleRequests.map((roleRequest) => {
          if (filter !== "all" && roleRequest.status !== filter) {
            return null;
          }
          if (filter === "all") {
            return (
              <div key={roleRequest._id}>
                <RoleRequestItem roleRequest={roleRequest} />
              </div>
            );
          }
          if (roleRequest.status === filter) {
            return (
              <>
                <div key={roleRequest._id}>
                  <RoleRequestItem roleRequest={roleRequest} />
                </div>
              </>
            );
          }
        })}
      </div>
    </div>
  );
};

const FilterDropdown = ({ filter, setFilter }) => {
  const options = [
    { value: "all", label: "Svi" },
    { value: ROLE_STATUSES.PENDING, label: "Na čekanju" },
    { value: ROLE_STATUSES.APPROVED, label: "Odobreni" },
    { value: ROLE_STATUSES.REJECTED, label: "Odbijeni" },
  ];

  return (
    <div className="relative filterSelect">
      <AppSelect
        options={options}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
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

export const RoleRequestStatus = ({ roleRequest }) => {
  const { status } = roleRequest;
  const [respondMenuOpen, setRespondMenuOpen] = useState(false);

  let statusBackground = "bg-gray-500";
  let statusColor = "text-white";
  switch (status) {
    case ROLE_STATUSES.APPROVED:
      statusBackground = "bg-green-500";
      break;
    case ROLE_STATUSES.REJECTED:
      statusBackground = "bg-red-500";
      break;
    case ROLE_STATUSES.PENDING:
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
      await api.put(`/general-manager/role-requests`, {
        requestId: roleRequest._id,
        response,
      });
      dispatch(
        requestResponseUpdate({
          roleRequestId: roleRequest._id,
          newStatus: response,
        }),
      );
      setRespondMenuOpen(false);
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error responding to role request:", error);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        onClick={() => onRespond(ROLE_STATUSES.APPROVED)}
      >
        Odobri
      </button>
      <button
        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        onClick={() => onRespond(ROLE_STATUSES.PENDING)}
      >
        Na čekanju
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        onClick={() => onRespond(ROLE_STATUSES.REJECTED)}
      >
        Odbij
      </button>
    </div>
  );
};
