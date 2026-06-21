"use client";

import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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
        <div className="text-3xl font-bold">
          Zahtjev za generalnog menadžera
        </div>
        <div className="flex justify-between items-center">
          <div className="text-lg">
            {appUser ? (
              <div>{`${appUser.name} ${appUser.surname} (${appUser.email})`}</div>
            ) : (
              "N/A"
            )}
          </div>
          {request?.status === ROLE_STATUSES.APPROVED ? (
            <div className="text-3xl p-4 text-green-600">
              <MdCheck />
            </div>
          ) : (
            <div className="flex gap-4 mt-2  items-center">
              <div
                className="btn submitButton"
                onClick={() => respond(ROLE_STATUSES.APPROVED)}
              >
                Odobri
              </div>
              <RoleRequestStatus
                roleRequest={{ status: request.status, _id: request._id }}
                generalManager={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
