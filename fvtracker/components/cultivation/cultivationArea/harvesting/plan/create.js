"use client";

import Link from "next/link";
import { SelectField } from "../../planting/plan/create";
import { useState } from "react";

export default function CreateHarvestingPlanPageComponent() {
  const [selectedField, setSelectedField] = useState(null);
  return (
    <>
      <div className="border p-4 rounded-lg">
        <SelectField
          selectedField={selectedField}
          setSelectedField={setSelectedField}
        />
      </div>
    </>
  );
}

export const CreateHarvestingPlanLink = ({}) => {
  return (
    <>
      <Link href={"/plan-berbe/izradi"}>
        <div className="btn">Izradi plan berbe</div>
      </Link>
    </>
  );
};
