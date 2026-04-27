"use client";

import { setSelectedFacility } from "@/store/production";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Facility({ slug }) {
  const dispatch = useDispatch();
  const facility = useSelector((state) => state.production.facilities.selected);

  useEffect(() => {
    if (!facility) {
      dispatch(setSelectedFacility(slug));
    }
  }, [slug, dispatch, facility]);

  console.log("Selected facility:", facility);

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
