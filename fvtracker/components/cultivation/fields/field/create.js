"use client";

import {  useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function CreateFieldPageComponent() {
  const { data: session, status } = useSession();
  const managerModelName = useSelector(
    (state) => state.user.session?.managerModelName,
  );

  return (
    <>
      <div>status: {status}</div>
      <div>{JSON.stringify(session)}</div>
      <div>{JSON.stringify(managerModelName)}</div>
    </>
  );
}
