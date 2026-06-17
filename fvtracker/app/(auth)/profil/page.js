"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import {
  WarehouseWorkerInfo,
  WorkerCommonInfo,
  WorkerSectorInfo,
} from "@/components/workers/profile";
import { ROLE_STATUSES } from "@/lib/constants/users";
import { MANAGER_TRANSLATION } from "@/lib/constants/users/managerTypes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log(session);

  const { email, employed, workerType, maangerModelName, isAdmin, roleStatus } =
    session?.user || {};

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

  return (
    <div>
      <CommonProfilePage {...session.user} />
    </div>
  );
}

export default ProfilePage;

const CommonProfilePage = ({
  email,
  employed,
  workerType,
  managerModelName,
  isAdmin,
  roleStatus,
  name,
  username,
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
            {roleStatus === ROLE_STATUSES.APPROVED ? "Odobren" : "Nije odobren"}
          </div>
        </>
      );
    }
  };
  return (
    <div>
      <div className="text-2xl font-bold underline">{name}</div>
      <div>{profileRole()}</div>
      <div>Korisničko ime: {username}</div>
      <div>Email: {email}</div>
    </div>
  );
};
