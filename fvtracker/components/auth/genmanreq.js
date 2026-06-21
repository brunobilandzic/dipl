"use client";

import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { RoleRequestStatus } from "../generalManager/managerRequests";

export const GeneralManagerRequestComponent = ({}) => {
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
              <div>
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
