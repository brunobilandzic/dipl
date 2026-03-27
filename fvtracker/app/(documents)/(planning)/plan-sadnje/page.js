import { CreatePlantagePlan } from "@/components/cultivation//cultivationArea/plans/planting/plan/create";
import PlantingPlanList from "@/components/cultivation/cultivationArea/plans/planting/plan/list";
import React from "react";

function PlantingPlanListPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <CreatePlantagePlan />
        <PlantingPlanList />
      </div>
    </>
  );
}

export default PlantingPlanListPage;
