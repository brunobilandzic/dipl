"use client";

import { useSession } from "next-auth/react";
import React from "react";

function ProfilePage() {
  const { data: session } = useSession();
  console.log(session);

  const { email, employed, workerType, maangerModelName, isAdmin, roleStatus } =
    session?.user || {};
  return <div>ProfilePage</div>;
}

export default ProfilePage;
