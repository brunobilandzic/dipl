"use client";

import Link from "next/link";
import {
  FillPlanInfo,
  SelectField,
} from "@/components/cultivation/cultivationArea/planting/plan/create";
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
      {selectedField ? (
        <div className="mt-4 rounded-lg border p-4">
          <FillPlanInfo
            selectedField={selectedField}
            setSelectedField={setSelectedField}
            plant={false}
          />
        </div>
      ) : null}
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
