import { CreateHarvestPlanButton } from "@/components/cultivation/cultivationArea/harvesting/plan/create";
import HarvestPlanList from "@/components/cultivation/cultivationArea/harvesting/plan/list";
import React from "react";

function HarvestPlanListPage() {
  return (
    <>
      <div className="flex flex-col gap-8">
        <HarvestPlanList />
        <CreateHarvestPlanButton />
      </div>
    </>
  );
}

export default HarvestPlanListPage;
