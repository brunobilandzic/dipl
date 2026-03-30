"use client";
import { LoadingFullScreen } from "@/components/layout/loading";
import { getHarvestingBatches } from "@/lib/utils/harvest";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function HarvestingBatches() {
  const fields = useSelector((state) => state.cultivation.fields);
  const [harvestingBatches, setHarvestingBatches] = useState(null);

  // set batches based on fields data
  useEffect(() => {
    if (!fields || harvestingBatches !== null) return;
    setHarvestingBatches(getHarvestingBatches({ fields }));
  }, [fields, harvestingBatches]);

  if (!fields) return <LoadingFullScreen />;

  return (
    <div>
      <h1>Harvesting Batches</h1>
      {harvestingBatches?.length}
      {/* Add your harvesting batches content here */}
    </div>
  );
}
