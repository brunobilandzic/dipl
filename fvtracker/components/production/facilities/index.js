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
  return (
    <>
      <ListItem>
        <div className={`flex justify-between items-center `}>
          <div>
            <div className="listitemheader">{stock?.product?.name}</div>
              <p>
                Sastojci:{" "}
                {getIngredientsList({
                  ingredients: stock?.product?.ingredients,
                })}
              </p>
              <p>
                Proizvdeno ukupno u postrojenju:{" "}
                {stock?.productionProcesses?.reduce(
                  (acc, curr) => acc + curr.quantity,
                  0,
                ) || 0}
              </p>
            </div>
          </div>
          <div className="text-3xl font-bold">
            {stock?.quantity <= 0 ? (
              <>
                {" "}
                <div className="text-xl flex flex-col items-center pt-1 gap-1">
                  <EmptyIcon />
                  <div className="text-xs text-gray-500 font-normal">
                    Nema novih zaliha
                  </div>
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
