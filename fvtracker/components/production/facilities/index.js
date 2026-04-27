"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { List, ListItem } from "@/components/layout/preview/list";
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
      <div>
        <ProductionStocks stocks={facility?.stocks} facilityName={facility?.name} />
      </div>
    </>
  );
}

const ProductionStocks = ({ stocks, facilityName }) => {
  console.log("Facility stocks:", stocks);
  return (
    <div>
      <List title={facilityName}>
        {stocks?.map((stock) => (
          <ProductStock key={stock._id} stock={stock} />
        ))}
      </List>
    </div>
  );
};

const ProductStock = ({ stock }) => {
  return (
    <>
      <ListItem
        title={stock?.product?.name}
        subtitle={`Količina: ${stock?.quantity}`}
      ></ListItem>
    </>
  );
};

export default Facility;
