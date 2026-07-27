import CreateHarvestingPlanPageComponent from "@/components/cultivation/plans/harvesting/create";
import { fetchManager } from "@/lib/auth/fetchSessionData";
import { CULTIVATION_MANAGER } from "@/lib/constants/users/managerTypes";
import React from "react";
import { UnathorizedPage } from "@/components/auth/unAuthorized";

async function CreateHarvestingPlanPage() {
  const { specificManager: cultivationManager } = await fetchManager({
    managerNames: [CULTIVATION_MANAGER],
    throwError: false,
  });
  if (!cultivationManager) {
    return (
      <UnathorizedPage message="Nemate pristup ovoj stranici. Prijavite se kao Menadžer Proizvodnje." />
    );
  }
  return (
    <div>
      <CreateHarvestingPlanPageComponent />
    </div>
  );
}

export default CreateHarvestingPlanPage;
