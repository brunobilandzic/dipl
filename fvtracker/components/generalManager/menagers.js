"use client";

import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Loading, LoadingFullScreen } from "../layout/loading";
import { RoleRequestStatus } from "./managerRequests";
import { List, ListItem } from "../layout/preview/list";
import { filterItems, initFilters } from "@/lib/utils/list";
import {
  CULTIVATION_MANAGER,
  FINANCIAL_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";
import {
  CultivationManagerListItem,
  FinancialManagerListItem,
  ProductionManagerListItem,
  WarehouseManagerListItem,
} from "./managerListItems";
import { sortManagers } from "@/lib/utils/managers/sort";

export const ManagerList = () => {
  const generalManager = useSelector((state) => state.generalManager?.manager);
  const isAdmin = useSelector((state) => state.user?.session?.isAdmin);
  const initialRoleFilters = useMemo(() => initFilters("roleRequest"), []);
  const [filters, setFilters] = useState(initialRoleFilters);
  const EMPTY_ARRAY = [];
  const allManagers = useMemo(
    () => generalManager?.managers ?? EMPTY_ARRAY,
    [generalManager?.managers],
  );
  const workers = useSelector((state) => state.workers?.items);
  console.log({ workers });

  const filteredManagers = useMemo(
    () =>
      sortManagers(
        filterItems({
          _items: allManagers,
          filters,
        }),
      ),
    [allManagers, filters],
  );

  if ((!generalManager && !isAdmin) || !workers) {
    return <LoadingFullScreen />;
  }

  return (
    <>
      <List
        title="Menadžeri"
        filters={filters}
        setFilters={setFilters}
        initialFilters={initialRoleFilters}
      >
        {filteredManagers.map((manager) => (
          <ManagerListItem
            key={manager._id}
            manager={manager}
            workers={workers.filter((w) => w.manager._id === manager._id)}
            allWorkers={workers}
          />
        ))}
      </List>
    </>
  );
};

const ManagerListItem = ({ manager, workers, allWorkers }) => {
  if (!manager || !manager.appUser) {
    return <Loading />;
  }

  if (manager.managerModelName === PRODUCTION_MANAGER) console.log({manager: manager.specificManager})

  return (
    <>
      <ListItem title={`${manager.appUser.name} ${manager.appUser.surname}`}>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">{manager.appUser.email}</p>
            <p className="text-sm text-gray-500">{manager.managerModelName}</p>
          </div>
        </div>
        {manager.managerModelName === PRODUCTION_MANAGER && (
          <ProductionManagerListItem workers={workers} />
        )}
        {manager.managerModelName === WAREHOUSE_MANAGER && (
          <WarehouseManagerListItem workers={workers} warehouseRequests={manager.specificManager.warehouseRequests} />
        )}
        {manager.managerModelName === CULTIVATION_MANAGER && (
          <CultivationManagerListItem workers={workers} />
        )}
        {manager.managerModelName === FINANCIAL_MANAGER && (
          <FinancialManagerListItem workers={workers} allWorkers={allWorkers} />
        )}
      </ListItem>
    </>
  );
};

export const CultivationManagerStatistics = ({ cultivationManager }) => {
  return (
    <>
      <div>
        <div>Fields created: {cultivationManager.fields.length}</div>
      </div>
    </>
  );
};
