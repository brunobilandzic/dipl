"use client";
import { LoadingFullScreen } from "@/components/layout/loading";
import { ListItem, List } from "@/components/layout/preview/list";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditWarehouseModal } from "./editWarehouse";

export const WarehouseList = () => {
  const warehouses = useSelector(
    (state) => state.warehouse.warehouses.filteredItems,
  );
  const dispatch = useDispatch();

  console.log({ warehouses });

  if (!warehouses) return <LoadingFullScreen />;

  return (
    <>
      <List
        title="Skladišta"
        onCreateItem={() => {}}
        addLabel="Dodaj skladište"
        deleteLabel="Obriši skladišta"
        onDeleteList={() => {}}
      >
        {warehouses.map((wh) => (
          <WarehouseListItem key={wh._id} warehouse={wh} />
        ))}
      </List>
    </>
  );
};

const WarehouseListItem = ({ warehouse }) => {
  const [editOpen, setEditOpen] = useState(false);
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
      <ListItem actionOptions={actionOptions} subtitle={warehouse.location}>
        <Link href={`/skladisne-jedinice/${warehouse.slug}`}>
          <div className="listitemheader">{warehouse.name}</div>
          <p className="listitemDescription">{warehouse.description}</p>
        </Link>
      </ListItem>
      {editOpen && (
        <EditWarehouseModal
          warehouse={warehouse}
          onCancel={() => setEditOpen(false)}
          isOpen={editOpen}
        />
      )}
    </div>
  );
};
