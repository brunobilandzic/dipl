"use client";

import { setManagerModelName } from "@/store/userSlice";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function CreateFieldPageComponent() {
  const { data: session, status } = getSession();
  const managerModelName = useSelector(
    (state) => state.user.session?.managerModelName,
  );

  useEffect(() => {
    console.log("Session status:", status);
    if (status === "authenticated" && session.user?.managerModelName) {
      setManagerModelName(session.user?.managerModelName);
    }
  }, [status]);

  return (
    <>
      <div>status: {status}</div>
      <div>{JSON.stringify(session)}</div>
      <div>{JSON.stringify(managerModelName)}</div>
    </>
  );
}
