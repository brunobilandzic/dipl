import HarvestingPlanPageComponent from "@/components/cultivation/cultivationArea/plans/harvesting/plan";
import React from "react";

async function HarvestingPlanPage({ params }) {
  const { slug } = await params;
  return (
    <div>
      <HarvestingPlanPageComponent slug={slug} />
    </div>
  );
}

export default HarvestingPlanPage;
