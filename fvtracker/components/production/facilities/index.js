"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { setSelectedFacility } from "@/store/production";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Facility({ slug }) {
  const dispatch = useDispatch();
  const facilities = useSelector((state) => state.production.facilities);
  const facility = facilities?.items?.find((f) => f.slug === slug);
  useEffect(() => {
    console.log("Facilities in state:", facilities);
    const facility = facilities?.items?.find((f) => f.slug === slug);
  }, [facilities]);

  console.log("Selected facility:", facility);

  if (!facility) return <LoadingFullScreen />;

  return (
    <>
      <div>Facility {facility?.name}</div>
      <div>
        <FacilityStocks stocks={facility?.stocks} />
      </div>
    </>
  );
}

const FacilityStocks = ({ stocks }) => {
  console.log("Facility stocks:", stocks);
  return <div>FacilityStocks {stocks?.length}</div>;
};

export default Facility;
