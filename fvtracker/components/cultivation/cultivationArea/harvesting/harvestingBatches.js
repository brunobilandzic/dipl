"use client";
import { LoadingFullScreen } from "@/components/layout/loading";
import React from "react";
import { useSelector } from "react-redux";

export default function HarvestingBatches() {
  const fields = useSelector((state) => state.cultivation.fields);

  if (!fields) return <LoadingFullScreen />;

  return (
    <div>
      <h1>Harvesting Batches</h1>
      {/* Add your harvesting batches content here */}
    </div>
  );
}
