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
      {harvestingBatches?.map((hb) => (
        <div key={uuid()}>
          <HarvestingBatch {...hb} />
        </div>
      ))}
      {/* Add your harvesting batches content here */}
    </div>
  );
}

const HarvestingBatch = ({
  harvestingBatchItems,
  harvestingPlan,
  productions,
  name,
}) => {
  return (
    <>
      <div>
        <h2>{name}</h2>
        <p>Harvesting Plan: {harvestingPlan?.name}</p>
        <p>Productions: {productions?.length}</p>
        <p>Batch Items: {harvestingBatchItems?.length}</p>
      </div>
    </>
  );
};
