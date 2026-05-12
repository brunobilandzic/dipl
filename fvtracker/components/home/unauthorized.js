"use client";

import { useSelector } from "react-redux";

export const UnathorizedHomepage = () => {
  const managerModelName = useSelector((state) => state.user.managerModelName);
  return <div>Homepage</div>;
};
