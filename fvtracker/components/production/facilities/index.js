import { LoadingFullScreen } from "@/components/layout/loading";
import React from "react";
import { useSelector } from "react-redux";

function Facility({ slug }) {
  const facility = useSelector((state) => state.production.facilities.selected);
  if(!facility) return <LoadingFullScreen />;
  return <div>Facility</div>;
}

export default Facility;
