import { CreateHarvestingPlanLink } from "@/components/cultivation/cultivationArea/plans/harvesting/plan/create";
import HarvestingPlanList from "@/components/cultivation/cultivationArea/plans/harvesting/plan/list";
import React from "react";

const CreateHarvestingPlanPage = () => {
  return (
    <div>
      <HarvestingPlanList />
      <CreateHarvestingPlanLink />
    </div>
  );
};

export default CreateHarvestingPlanPage;
