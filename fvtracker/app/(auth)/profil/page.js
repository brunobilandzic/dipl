"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
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

  return <div>ProfilePage</div>;
}

export default ProfilePage;

const CommonProfilePage = ({
  email,
  employed,
  workerType,
  maangerModelName,
  isAdmin,
  roleStatus,
}) => {
  return (
    <div>
      <div className="heading"></div>
    </div>
  );
};
