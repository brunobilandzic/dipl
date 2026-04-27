"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { setSelectedFacility } from "@/store/production";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function Facility({ slug }) {
  const dispatch = useDispatch();
  const facility = useSelector((state) => state.production.facilities.selected);
  if (!facility) {
    dispatch(setSelectedFacility(slug));
  }
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
  return <div>FacilityStocks {stocks?.length}</div>;
};

export default Facility;
