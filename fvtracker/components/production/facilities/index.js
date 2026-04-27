import { LoadingFullScreen } from "@/components/layout/loading";
import React from "react";
import { useSelector } from "react-redux";

function Facility({ slug }) {
  const facility = useSelector((state) => state.production.facilities.selected);
  if (!facility) return <LoadingFullScreen />;
  return (
    <>
      <div>Facility {facility.name}</div>
      <div>
        <FacilityStocks stocks={facility.stocks} />
      </div>
    </>
  );
}

const FacilityStocks = ({ stocks }) => {
  if (!stocks) return <LoadingFullScreen />;
  return <div>FacilityStocks {stocks.length}</div>;
};

export default Facility;
