"use client";

import React from "react";
import { useSelector } from "react-redux";

function WarehousePageComponent({ slug }) {
  const warehouses = useSelector((state) => state.warehouse.warehouses.items);
  const warehouse = warehouses?.find((w) => w.slug === slug);

  console.log({ warehouse });

  if (!warehouse) return <div>Warehouse not found</div>;
  return <div>WarehousePageComponent</div>;
}

export default WarehousePageComponent;
