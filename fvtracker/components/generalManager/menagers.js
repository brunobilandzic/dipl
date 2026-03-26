"use client";

import { useSelector } from "react-redux";

export const ManagerList = () => {
  const generalManager = useSelector((state) => state.generalManager?.manager);

  return <>{JSON.stringify(generalManager, null, 2)}</>;
};
