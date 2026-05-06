"use client";
import { ListItem, List } from "@/components/layout/preview/list";
import { useState } from "react";
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
  const [edit, setEdit] = useState(false);
  const handleDelete = () => {};
  const actionOptions = [
    {
      label: "Uredi",
      className: "",
      onClick: () => setEditOpen(true),
    },
    {
      label: "Obriši",
      className: "cancelButton",
      onClick: handleDelete,
    },
  ];

  return (
    <div>
      <ListItem
        actionOptions={actionOptions}
        title={warehouse.name}
        subtitle={warehouse.location}
      ></ListItem>
    </div>
  );
};
