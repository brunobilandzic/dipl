import { CreateHarvestingPlanLink } from "@/components/cultivation/plans/harvesting/plan/create";
import HarvestingPlanList from "@/components/cultivation/plans/harvesting/plan/list";
import React from "react";

const CreateHarvestingPlanPage = () => {
  return (
    <div className="flex flex-col gap-2">
      <CreateHarvestingPlanLink />
      <HarvestingPlanList />
    </div>
  );
};

export default CreateHarvestingPlanPage;
