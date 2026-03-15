"use client";

import Link from "next/link";
import React from "react";

function CreatePlantingPlanPageComonent() {
  return <div>CreatePlantingPlanPageComonent</div>;
}

export default CreatePlantingPlanPageComonent;

export const CreatePlantagePlan = ({}) => {
  return (
    <>
      <Link href={"/plan-sadnje/izradi"}>
        <div
          className="btn"
        >
          Izradi plan sadnje
        </div>
      </Link>
    </>
  );
};
