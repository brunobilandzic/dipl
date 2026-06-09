"use client";

import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Loading, LoadingFullScreen } from "../layout/loading";
import { RoleRequestStatus } from "./managerRequests";
import { List, ListItem } from "../layout/preview/list";
import { filterItems, initFilters } from "@/lib/utils/list";

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

  const filteredManagers = useMemo(
    () =>
      filterItems({
        _items: allManagers,
        filters,
      }),
    [allManagers, filters],
  );

  useEffect(() => {
    console.log("General Manager:", generalManager);
    if (!generalManager && !isAdmin) {
      console.warn(
        "General Manager data is not available. This may indicate an issue with fetching the general manager data or that the user does not have the necessary permissions.",
      );
    }
  }, [generalManager, isAdmin]);

  if (!generalManager && !isAdmin) {
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
          <ManagerListItem key={manager._id} manager={manager} />
        ))}
      </List>
    </>
  );
};

const ManagerListItem = ({ manager }) => {
  if (!manager || !manager.appUser) {
    return <Loading />;
  }

  return (
    <>
      <ListItem title={`${manager.appUser.name} ${manager.appUser.surname}`}>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">{manager.appUser.email}</p>
            <p className="text-sm text-gray-500">{manager.managerModelName}</p>
          </div>
          <div>
            <RoleRequestStatus roleRequest={manager.roleRequest} />
          </div>
        </div>
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
