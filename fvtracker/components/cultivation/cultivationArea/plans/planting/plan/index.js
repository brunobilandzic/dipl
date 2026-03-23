"use client";

import React from "react";
import PlanPageComponent from "@/components/cultivation/cultivationArea/plans/common/planPage";

const PlantiPlanPageComponent = ({ slug }) => {
  return <PlanPageComponent slug={slug} plant={true} />;
};

export default PlantiPlanPageComponent;
