import CreateWarehouse from "@/components/warehouse/objects/create";
import { fetchManager } from "@/lib/auth/fetchSessionData";
import { WAREHOUSE_MANAGER } from "@/lib/constants/users/managerTypes";
import React from "react";

async function CreateWarehousePage() {
  await fetchManager({
    managerNames: [WAREHOUSE_MANAGER],
  });
  return (
    <div>
      <CreateWarehouse />
    </div>
  );
}

export default CreateWarehousePage;
