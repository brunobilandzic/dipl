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
import { prepareFacilityStocksInfo } from "@/lib/utils/production/facilities";
import { useMemo } from "react";

export const WarehouseList = () => {
  const warehouses = useSelector(
    (state) => state.warehouse.warehouses.filteredItems,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [sortBy, setSortBy] = useState(SORT_INIT_VALUE);
  const initialFilters = useMemo(() => initFilters("warehouses"), []);
  const [filters, setFilters] = useState(initialFilters);

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
        initialFilters={initialFilters}
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
  const { totalQuantity, productCount, totalVolumeUsed } =
    prepareFacilityStocksInfo({ stocks: warehouse.stocks });
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
      <ListItem actionOptions={actionOptions}>
        <Link href={`/skladisne-jedinice/${warehouse.slug}`}>
          <div className="flex justify-between">
            <div>
              <div className="listitemheader">{warehouse.name}</div>
              <div className="listitemDescription">
                <p>{warehouse.description}</p>
                <p>Kapacitet: {warehouse.volume}</p>
                <p>Kreirano: {showDate(warehouse.createdAt)}</p>
              </div>
            </div>
            <div>
              <WarehouseStats
                stocks={warehouse.stocks}
                warehouseVolume={warehouse.volume}
              />
            </div>
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

const WarehouseStats = ({ stocks, warehouseVolume }) => {
  const { productCount, totalQuantity, totalVolumeUsed } =
    prepareFacilityStocksInfo({ stocks });
  return (
    <>
      <div className="text-sm text-gray-500 text-right flex flex-col items-end">
        <p className="flex items-center gap-1">
          Zauzeto: {totalVolumeUsed} od {warehouseVolume}
        </p>
      </div>
    </>
  );
};
