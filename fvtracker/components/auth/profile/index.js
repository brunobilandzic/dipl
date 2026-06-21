"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { ROLE_STATUSES } from "@/lib/constants/users";
import { MANAGER_TRANSLATION } from "@/lib/constants/users/managerTypes";
import { WORKER_TRANSLATION } from "@/lib/constants/users/workers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { WorkerProfile } from "./workers";

const ProfileComponent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const worker = useSelector((state) => state.workers.worker);

  const { workerType } = session?.user || {};

  if (status === "loading") {
    return (
      <div>
        <LoadingFullScreen />
      </div>
    );
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/uloga-nije-odobrena");
    }
  }, [status, router]);

  if (session.user.generalManagerRequest)
    return (
      <div>
        <CommonProfilePage
          {...session.user}
          generalManagerRequest={session.user.generalManagerRequest}
        />
        {workerType && worker && (
          <>
            <WorkerProfile worker={worker} workerType={workerType} />
          </>
        )}
      </div>
    );
};

export default ProfileComponent;

const CommonProfilePage = ({
  email,
  employed,
  workerType,
  managerModelName,
  isAdmin,
  roleStatus,
  name,
  username,
  generalManagerRequest,
}) => {
  const profileRole = () => {
    if (isAdmin) {
      return "Administrator";
    } else if (workerType) {
      return (
        <>
          <div>{WORKER_TRANSLATION[workerType]}</div>
          <div>{employed ? "Zaposlen" : "Nezaposlen"}</div>
        </>
      );
    } else if (managerModelName) {
      return (
        <>
          <div>{MANAGER_TRANSLATION[managerModelName]}</div>
          <div>
            Zahtjev za ulogu:{" "}
            {roleStatus === ROLE_STATUSES.APPROVED ||
            generalManagerRequest === ROLE_STATUSES.APPROVED
              ? "Odobren"
              : "Nije odobren"}
          </div>
        </>
      );
    }
  };
  return (
    <div className="mb-2">
      <div className="text-2xl font-bold underline mb-2">{name}</div>
      <div>{profileRole()}</div>
      <div>Korisničko ime: {username}</div>
      <div>Email: {email}</div>
    </div>
  );
};
