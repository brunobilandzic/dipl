import { CreatePlantagePlan } from "@/components/cultivation/cultivationArea/planting/plan/create";
import PlantingPlanList from "@/components/cultivation/cultivationArea/planting/plan/list";
import React from "react";

function PlantingPlanListPage() {
  return (
    <>
      <div className="flex flex-col gap-8">
        <PlantingPlanList />
        <CreatePlantagePlan />
      </div>
    </>
  );
}

export default PlantingPlanListPage;
