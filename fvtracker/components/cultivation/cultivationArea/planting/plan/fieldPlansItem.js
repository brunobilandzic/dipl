import React from "react";

function FieldPlan({ fieldPlans }) {
  const { fieldName, plantingPlans } = fieldPlans;
  return (
    <div>
      <div className="font-bold text-lg mb-4">{fieldName}:</div>
      <div className="flex flex-col">
        {plantingPlans.map((plan) => JSON.stringify(plan))}
      </div>
    </div>
  );
}

export default FieldPlan;
