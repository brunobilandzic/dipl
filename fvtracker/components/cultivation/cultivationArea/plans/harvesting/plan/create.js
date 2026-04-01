"use client";

import Link from "next/link";
import {
  FillPlanInfo,
  SelectField,
} from "@/components/cultivation/cultivationArea/plans/planting/plan/create";
import { useState } from "react";
import { AppSelect } from "@/components/form/inputs";

export default function CreateHarvestingPlanPageComponent() {
  const [selectedField, setSelectedField] = useState(null);
  return (
    <>
      <div className="">
        <div className="font-bold text-3xl mb-2 underline">Izaberi polje:</div>
        <SelectField
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          plant={false}
        />
      </div>
      <div></div>
      {selectedField ? (
        <div className="mt-4 rounded-lg border p-4">
          <FillPlanInfo selectedField={selectedField} plant={false} />
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

const SelectProductionManager = ({
  productionManagers,
  selectedProductionManager,
  setSelectedProductionManager,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">Odaberite voditelja proizvodnje:</label>
      <AppSelect
        options={productionManagers.map((pm) => ({
          value: pm._id,
          label: pm.name,
        }))}
        value={selectedProductionManager}
        onChange={(e) => setSelectedProductionManager(e.target.value)}
        placeholder="Odaberite voditelja proizvodnje"
      />
    </div>
  );
};
