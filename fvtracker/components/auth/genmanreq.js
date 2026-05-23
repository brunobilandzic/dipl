"use client";

import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { ROLE_STATUSES } from "@/lib/constants/users";
import { setLoading } from "@/store/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdCheck } from "react-icons/md";
import { useDispatch } from "react-redux";

export const GeneralManagerRequestComponent = ({}) => {
  const [request, setRequest] = useState(null);
  const appUser = request?.generalManager?.rootManager?.appUser;
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    console.log({ request });
  }, [request]);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await api.get("/genman-requests");
        console.log({ response });
        setRequest(response.data.generalManagerRequest);
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

  useEffect(() => {
    console.log(appUser);
    return () => console.log("UNMOUNT");
  }, []);

  const respond = async (status) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post("/genman-requests", { status });
      console.log({ response });
      router.refresh();
    } catch (error) {
      console.error("Error approving general manager request:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

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
              <div
                className="btn cancelButton"
                onClick={() => respond(ROLE_STATUSES.REJECTED)}
              >
                Odbaci
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
