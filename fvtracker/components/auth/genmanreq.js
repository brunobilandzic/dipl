"use client";

import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { RoleRequestStatus } from "../generalManager/managerRequests";
import { List, ListItem } from "../layout/preview/list";

export const GeneralManagerRequestsComponent = ({}) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await api.get("/genman-requests");
        setRequests(response.data.generalManagerRequests);
      } catch (error) {
        handleError({
          ...error,
          customMessage:
            "Greška prilikom dohvatanja zahteva za generalnog menadžera",
        });
      }
    };

    fetchRequest();
  }, []);

  return (
    <div>
      <List title="Zahtjevi za generalnog menadžera">
        <></>
        {requests?.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Trenutno nema zahteva za generalnog menadžera.
          </div>
        )}
        {requests?.map((request, i) => (
          <ListItem key={i}>
            <div className="flex gap-2 items-center">
              <div>{request.generalManager.rootManager.appUser.username}</div>
              {request.generalManager.rootManager.appUser
                ? `${request.generalManager.rootManager.appUser.name} ${request.generalManager.rootManager.appUser.surname} (${request.generalManager.rootManager.appUser.email})`
                : null}
            </div>
            <RoleRequestStatus
              roleRequest={{ status: request.status, _id: request._id }}
              generalManager={true}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export const GeneralManagerRequestComponent_bup = ({}) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await api.get("/genman-requests");
        setRequests(response.data.generalManagerRequests);
      } catch (error) {
        handleError({
          ...error,
          customMessage:
            "Greška prilikom dohvatanja zahteva za generalnog menadžera",
        });
      }
    };

    fetchRequest();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="text-xl font-bold">Zahtjev za generalnog menadžera</div>
        <div className="flex flex-col gap-6">
          {requests?.map((request, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-6 border"
            >
              <div className="flex gap-2 items-center">
                <div>{request.generalManager.rootManager.appUser.username}</div>
                {request.generalManager.rootManager.appUser
                  ? `${request.generalManager.rootManager.appUser.name} ${request.generalManager.rootManager.appUser.surname} (${request.generalManager.rootManager.appUser.email})`
                  : null}
              </div>
              <RoleRequestStatus
                roleRequest={{ status: request.status, _id: request._id }}
                generalManager={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
