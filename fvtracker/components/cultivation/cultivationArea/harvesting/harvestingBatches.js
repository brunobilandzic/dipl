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
    <div>
      <h1>Harvesting Batches</h1>
      {Object.keys(harvestingBatches).map((fieldName) => (
        <div key={uuid()}>
          <HarvestingBatch
            fieldName={fieldName}
            harvestingPlans={harvestingBatches[fieldName]}
          />
        </div>
      ))}
    </div>
  );
}

const HarvestingBatch = ({ fieldName, harvestingPlans }) => {
  return (
    <>
      <div>
        <h2>{fieldName}</h2>
        {Object.keys(harvestingPlans).map((planName) => (
          <div key={uuid()}>
            <p>Harvesting Plan: {planName}</p>
            <p>Productions: {harvestingPlans[planName]?.productions?.length}</p>
            <p>
              Batch Items:{" "}
              {harvestingPlans[planName]?.harvestingBatchItems?.length}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
