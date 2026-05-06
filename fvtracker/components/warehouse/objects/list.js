"use client";
import { ListItem, List } from "@/components/layout/preview/list";
import { useDispatch, useSelector } from "react-redux";

export const WarehouseList = () => {
  const warehouses = useSelector(
    (state) => state.warehouse.warehouses.filteredItems,
  );
  const dispatch = useDispatch();

  console.log({ warehouses });

  return (
    <>
      <List title="Skladišta">
        {warehouses.map((wh) => (
          <WarehouseListItem key={wh._id} warehouse={wh} />
        ))}
      </List>
    </>
  );
};

const WarehouseListItem = ({ warehouse }) => {
  return (
    <div>
      <ListItem title={warehouse.name} subtitle={warehouse.location} />
    </div>
  );
};
