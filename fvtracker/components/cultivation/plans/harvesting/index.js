"use client";

import React from "react";
import PlanPageComponent from "@/components/cultivation/plans/common/planPage";

const HarvestingPlanPageComponent = ({ slug }) => {
  return <PlanPageComponent slug={slug} plant={false} />;
};

export default HarvestingPlanPageComponent;
