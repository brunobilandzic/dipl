"use client";
import { useDispatch, useSelector } from "react-redux";

export const WarehouseList = () => {
  const warehouses = useSelector((state) => state.warehouses);
  const dispatch = useDispatch();

  console.log({ warehouses });

  return (
    <>
      <div>skladista</div>
    </>
  );
};
