"use client";

import React, { useState } from "react";
import { FaCubesStacked } from "react-icons/fa6";
import { useSelector } from "react-redux";

function WarehousePageComponent({ slug }) {
  const warehouses = useSelector((state) => state.warehouse.warehouses.items);
  const warehouse = warehouses?.find((w) => w.slug === slug);

  const [stocksView, setStocksView] = useState(false);

  const options = [
    {
      label: "Proizvodi",
      icon: <FaCubesStacked />,
      onClick: () => {
        setStocksView(true);
      },
    },
  ];

  console.log({ warehouse });

  if (!warehouse) return <div>Warehouse not found</div>;
  if (stocksView) {
    return <div>Stocks view for {warehouse.name}</div>;
  }
  return <div>WarehousePageComponent</div>;
}

const WarehouseOptions = ({ options }) => {};

export default WarehousePageComponent;
