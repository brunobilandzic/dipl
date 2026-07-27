import { UnathorizedPage } from "@/components/auth/unAuthorized";
import { WarehouseList } from "@/components/warehouse/list";
import { fetchManager } from "@/lib/auth/fetchSessionData";
import { WAREHOUSE_MANAGER } from "@/lib/constants/users/managerTypes";
import React from "react";

async function WarehouseListPage() {
  const { specificManager, generalManager, unAuthorized } = await fetchManager({
    managerNames: [WAREHOUSE_MANAGER],
  });
  if (unAuthorized) return <UnathorizedPage />;

  return <div>{specificManager && <WarehouseList />}</div>;
}

export default WarehouseListPage;
