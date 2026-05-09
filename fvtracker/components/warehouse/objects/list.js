"use client";
import { LoadingFullScreen } from "@/components/layout/loading";
import { ListItem, List } from "@/components/layout/preview/list";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditWarehouseModal } from "./editWarehouse";
import { useRouter } from "next/navigation";
import { deleteWarehouse } from "@/lib/utils/storage/warehouse";
import { deleteWarehouses } from "@/lib/utils/storage/warehouse";
import { showDate } from "@/lib/utils/display";
import { SORT_INIT_VALUE } from "@/lib/constants/others";
import { filterWarehouses, sortWarehouses } from "@/store/warehouse";
import { initFilters } from "@/lib/utils/list";

export const WarehouseList = () => {
  const warehouses = useSelector(
    (state) => state.warehouse.warehouses.filteredItems,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [sortBy, setSortBy] = useState(SORT_INIT_VALUE);
  const [filters, setFilters] = useState(initFilters("warehouses"));

  console.log({ warehouses });

  useEffect(() => {
    if (!warehouses) return;
    dispatch(sortWarehouses(sortBy));
  }, [sortBy]);
  useEffect(() => {
    if (!warehouses) return;
    dispatch(filterWarehouses(filters));
  }, [filters]);

  if (!warehouses) return <LoadingFullScreen />;

  return (
    <>
      <List
        title="Skladišta"
        onCreateItem={() => {
          router.push("/skladisne-jedinice/dodavanje");
        }}
        addLabel="Dodaj skladište"
        deleteLabel="Obriši skladišta"
        onDeleteList={() => {
          deleteWarehouses({ dispatch, router });
        }}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filters={filters}
        setFilters={setFilters}
        initialFilters={initFilters("warehouses")}
      >
        {warehouses.map((wh) => (
          <WarehouseListItem
            dispatch={dispatch}
            router={router}
            key={wh._id}
            warehouse={wh}
          />
        ))}
      </List>
    </>
  );
};

const WarehouseListItem = ({ warehouse, dispatch, router }) => {
  const [editOpen, setEditOpen] = useState(false);
  const handleDelete = () => {
    deleteWarehouse({ warehouseId: warehouse._id, dispatch, router });
  };
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
          <div className="listitemDescription">
            <p>{warehouse.description}</p>
            <p>Kapacitet: {warehouse.volume}</p>
            <p>Kreirano: {showDate(warehouse.createdAt)}</p>
          </div>
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
