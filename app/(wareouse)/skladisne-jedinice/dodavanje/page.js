import CreateWarehouse from "@/components/warehouse/create";
import { checkManager } from "@/lib/auth/fetchSessionData";
import { WAREHOUSE_MANAGER } from "@/lib/constants/users/managerTypes";
import React from "react";

async function CreateWarehousePage() {
  await checkManager({
    managerNames: [WAREHOUSE_MANAGER],
  });
  return (
    <div>
      <CreateWarehouse />
    </div>
  );
}

export default CreateWarehousePage;
