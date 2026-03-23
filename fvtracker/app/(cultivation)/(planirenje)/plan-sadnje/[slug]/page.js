import PlantiPlanPageComponent from "@/components/cultivation/cultivationArea/plans/planting/plan";
import React from "react";

async function PlantingPlanPage({ params }) {
  const { slug } = await params;
  return (
    <div>
      <PlantiPlanPageComponent slug={slug} />
    </div>
  );
}

export default PlantingPlanPage;
