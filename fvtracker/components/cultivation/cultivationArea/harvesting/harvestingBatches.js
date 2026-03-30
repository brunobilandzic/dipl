"use client";
import { LoadingFullScreen } from "@/components/layout/loading";
import { getHarvestingBatches } from "@/lib/utils/harvest";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

export default function HarvestingBatches() {
  const fields = useSelector((state) => state.cultivation.fields);
  const [harvestingBatches, setHarvestingBatches] = useState(null);

  // set batches based on fields data
  useEffect(() => {
    if (!fields || harvestingBatches !== null) return;
    setHarvestingBatches(getHarvestingBatches({ fields }));
  }, [fields, harvestingBatches]);

  if (!harvestingBatches) return <LoadingFullScreen />;

  console.log("harvestingBatches", harvestingBatches);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="border-b-2 font-bold text-3xl">Žetve</h1>
      <div>
        {Object.keys(harvestingBatches).map((fieldName) => (
          <div key={uuid()}>
            <HarvestingBatch
              fieldName={fieldName}
              harvestingPlans={harvestingBatches[fieldName]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const HarvestingBatch = ({ fieldName, harvestingPlans, name }) => {
  return (
    <>
      <div className="border p-4 rounded-lg">
        <h2>Polje: {fieldName}</h2>
        {Object.keys(harvestingPlans).map((planName) => (
          <div className="border p-4" key={uuid()}>
            <p>Plan berbe: {planName}</p>
            <p>Žetva: {harvestingPlans[planName]?.name}</p>
            <p>Proizvodnja: {harvestingPlans[planName]?.productions?.length}</p>
            <p>
              Stavke: {harvestingPlans[planName]?.harvestingBatchItems?.length}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
