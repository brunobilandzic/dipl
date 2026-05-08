"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { EmptyIcon } from "@/components/layout/preview/icons";
import { List, ListItem } from "@/components/layout/preview/list";
import { getIngredientsList } from "@/lib/utils/production/products";
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
        <ProductionStocks
          stocks={facility?.stocks}
          facilityName={facility?.name}
        />
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
  if (!stock) return;
  console.log({ stock });
  return (
    <>
      <ListItem>
        <div className={`flex justify-between items-center `}>
          <div>
            <div className="listitemheader">{stock?.product?.name}</div>
            <p className="listitemDescription">
              {getIngredientsList({ ingredients: stock?.product?.ingredients })}
            </p>
          </div>
          <div className="text-3xl font-bold">
            {stock?.quantity <= 0 ? (
              <>
                {" "}
                <div className="text-xl flex items-center pt-1">
                  <EmptyIcon />
                </div>
              </>
            ) : (
              stock.quantity
            )}
          </div>
        </div>
      </ListItem>
    </>
  );
};

export default Facility;
