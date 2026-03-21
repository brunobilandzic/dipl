import CreateHarvestingPlanPageComponent, {
  CreateHarvestingPlanLink,
} from "@/components/cultivation/cultivationArea/harvesting/plan/create";
import HarvestingPlanList from "@/components/cultivation/cultivationArea/harvesting/plan/list";
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
