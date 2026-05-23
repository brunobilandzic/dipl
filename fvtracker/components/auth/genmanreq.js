"use client";

import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { ROLE_STATUSES } from "@/lib/constants/users";
import { setLoading } from "@/store/loading";
import { useState } from "react";
import { useDispatch } from "react-redux";

export const GeneralManagerRequestComponent = ({ request }) => {
  const appUser = request?.generalManager?.rootManager?.appUser;
  const [approved, setApproved] = useState(
    request?.status === ROLE_STATUSES.APPROVED,
  );
  const dispatch = useDispatch();

  const approveRequest = async () => {
    try {
      dispatch(setLoading(true));
      await api.post("/genman-requests", {});
      setApproved(true);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Error approving general manager request:", error);
      handleError({
        ...error,
        customMessage: "Greška prilikom odobravanja zahteva",
      });
    }
  };
  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="text-3xl font-bold">
          Zahtjev za generalnog menadžera
        </div>
        <div className="text-lg">
          <div>
            {appUser
              ? `${appUser.name} ${appUser.surname} (${appUser.email})`
              : "N/A"}
          </div>
          {approved ? (
            "odobreno"
          ) : (
            <div className="btn submitButton mt-2" onClick={approveRequest}>
              Odobri
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
