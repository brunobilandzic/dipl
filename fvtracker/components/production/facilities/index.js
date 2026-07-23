"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { EmptyIcon } from "@/components/layout/preview/icons";
import { List, ListItem } from "@/components/layout/preview/list";
import { getIngredientsList } from "@/lib/utils/production/products";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateWarehouseStock from "../products/stock/CreateWarehouseStock";

function Facility({ slug }) {
  const dispatch = useDispatch();
  const facility = useSelector((state) =>
    state.production.facilities?.items?.find((f) => f.slug === slug),
  );

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
  const [addWarehouseStockModalOpen, setAddWarehouseStockModalOpen] =
    useState(false);
  const warehouses = useSelector((state) => state.warehouse.warehouses.items);
  const actionOptions = [
    {
      label: "Dodaj na skladište",
      onClick: () => {
        setAddWarehouseStockModalOpen(true);
      },
      className: "submitButton",
    },
  ];
  if (!stock) return;

  const totalProcesses = stock.productionProcesses?.length || 0;
  return (
    <>
      <ListItem actionOptions={actionOptions}>
        <StockItem
          product={stock.product}
          productionProcesses={stock.productionProcesses}
          quantity={stock.quantity}
          totalProcesses={totalProcesses}
        />
      </ListItem>
      {addWarehouseStockModalOpen && (
        <CreateWarehouseStock
          isOpen={addWarehouseStockModalOpen}
          onCancel={() => setAddWarehouseStockModalOpen(false)}
          product={stock.product}
          clickedStock={stock}
          warehouses={warehouses}
          facility={true}
        />
      )}
    </>
  );
};

export default Facility;

export function StockItem({
  product,
  productionProcesses,
  quantity,
  totalProcesses,
}) {
  return (
    <div className={`flex justify-between items-center relative `}>
      <div>
        <div className="listitemheader">{product?.name}</div>
        <div className="listitemDescription">
          <p>
            Sastojci:{" "}
            {getIngredientsList({
              ingredients: product?.ingredients,
            })}
          </p>
          <p>
            Proizvdeno:{" "}
            {productionProcesses?.reduce(
              (acc, curr) => acc + curr.quantity,
              0,
            ) || 0}
          </p>
          <p>Procesi: {totalProcesses}</p>
        </div>
      </div>
      <div className="stockQuantity">
        {quantity <= 0 ? (
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
          quantity
        )}
      </div>
    </div>
  );
}
