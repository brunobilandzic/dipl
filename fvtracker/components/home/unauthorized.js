"use client";

import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";

export const UnathorizedHomepage = () => {
  const { data: session, status } = useSession();
  return <div>Homepage</div>;
};
