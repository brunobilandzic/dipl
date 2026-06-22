"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "@/lib/api";
import { useState, useEffect, useMemo } from "react";
import { setLoading } from "@/store/loading";
import { AppSelect } from "../form/inputs";
import { ROLE_STATUSES } from "@/lib/constants/users";
import { requestResponseUpdate } from "@/store/generalManager";
import { List, ListItem } from "../layout/preview/list";
import { filterItems, initFilters } from "@/lib/utils/list";
import handleError from "@/lib/constants/errors/client/handleError";
import { MANAGER_TRANSLATION } from "@/lib/constants/users/managerTypes";

export const RoleRequestList = () => {
  const generalManager = useSelector((state) => state.generalManager.manager);
  const initialFilters = useMemo(() => initFilters("roleRequest"), []);
  const [filters, setFilters] = useState(initialFilters);

  const allRoleRequests = useMemo(
    () => generalManager?.roleRequests || [],
    [generalManager],
  );
  const [filteredRoleRequests, setFilteredRoleRequests] =
    useState(allRoleRequests);

  useEffect(() => {
    if (!generalManager) return;
    setFilteredRoleRequests((prev) =>
      filterItems({
        _items: allRoleRequests,
        filters,
      }),
    );
  }, [filters, allRoleRequests]);

  return (
    <>
      <List
        title="Zahtjevi za uloge"
        filters={filters}
        setFilters={setFilters}
        initialFilters={initialFilters}
      >
        {filteredRoleRequests.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            Nema zahtjeva za menadžere.
          </div>
        )}
        {filteredRoleRequests.map((roleRequest) => (
          <RoleRequestItem key={roleRequest._id} roleRequest={roleRequest} />
        ))}
      </List>
    </>
  );
};

export const RoleRequestItem = ({ roleRequest }) => {
  const { name, surname } = roleRequest.rootManager.appUser;

  return (
    <>
      <ListItem>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">{`${name} ${surname}`}</h3>
            <div>
              {MANAGER_TRANSLATION[roleRequest.rootManager.managerModelName]}
            </div>
          </div>
          <div>
            <RoleRequestStatus roleRequest={roleRequest} />
          </div>
        </div>
      </ListItem>
    </>
  );
};

export const RoleRequestStatus = ({ roleRequest, generalManager = false }) => {
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
            generalManager={generalManager}
          />
        </div>
      )}
    </div>
  );
};

const RespondMenu = ({ roleRequest, setRespondMenuOpen, generalManager }) => {
  const dispatch = useDispatch();
  const onRespond = async (response) => {
    try {
      dispatch(setLoading(true));
      console.log({ roleRequest, response });
      generalManager
        ? await api.post("/genman-requests", {
            status: response,
            _id: roleRequest._id,
          })
        : await api.put(`/general-manager/role-requests`, {
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
      handleError({
        ...error,
        generalMessage: "Greška prilikom odgovaranja na zahtev za ulogu",
      });
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className="btn secondaryButton"
        onClick={() => setRespondMenuOpen(false)}
      >
        Odustani
      </button>
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
