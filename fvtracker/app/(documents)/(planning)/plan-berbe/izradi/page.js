import CreateHarvestingPlanPageComponent from "@/components/cultivation/plans/harvesting/create";
import { fetchManager } from "@/lib/auth/fetchSessionData";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";
import React from "react";

async function CreateHarvestingPlanPage() {
  await fetchManager({ managerNames: [CULTIVATION_MANAGER] });
  return (
    <div>
      <CreateHarvestingPlanPageComponent />
    </div>
  );
}

export default CreateHarvestingPlanPage;
