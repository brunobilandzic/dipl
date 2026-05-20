"use client";
import { LoadingFullScreen } from "@/components/layout/loading";
import { harvestingBatchesFields } from "@/lib/utils/cultivation/plant/harvest";
import { harvestingBatchItemData } from "@/lib/utils/cultivation/plant/harvestingBatches";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

export default function HarvestingBatchesFields() {
  const fields = useSelector((state) => state.cultivation.fields);
  const [harvestingBatches, setHarvestingBatches] = useState(null);
  const [plansOpen, setPlansOpen] = useState(false);

  // set batches based on fields data
  useEffect(() => {
    if (!fields || harvestingBatches !== null) return;
    setHarvestingBatches(harvestingBatchesFields({ fields }));
  }, [fields, harvestingBatches]);

  if (!harvestingBatches) return <LoadingFullScreen />;

  console.log("harvestingBatches", harvestingBatches);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="border-b-2 font-bold text-3xl">Žetve</h1>
      <div className="flex flex-col gap-4">
        {Object.keys(harvestingBatches).map((fieldName) => (
          <div key={uuid()}>
            <div
              onClick={() => setPlansOpen(!plansOpen)}
              className="flex flex-col justify-between border p-4 rounded-lg gap-4 cursor-pointer"
            >
              <h2 className="font-semibold text-xl">Polje: {fieldName}</h2>

              {plansOpen && (
                <HarvestingBatches
                  harvestingPlans={harvestingBatches[fieldName]}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const HarvestingBatches = ({ harvestingPlans }) => {
  return (
    <>
      <div className="flex flex-col gap-4 mt-4">
        {Object.keys(harvestingPlans).map((planName) => (
          <div className="border p-4" key={uuid()}>
            <p>Plan berbe: {planName}</p>
            <p>Žetva: {harvestingPlans[planName]?.name}</p>
            <p>Proizvodnja: {harvestingPlans[planName]?.productions?.length}</p>
            <p>Stavke žetve:</p>
            <div className="flex flex-col gap-2 mt-2">
              {harvestingPlans[planName]?.harvestingBatchItems?.map(
                (batchItem) => (
                  <HarvestingBatchItem key={uuid()} batchItem={batchItem} />
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const HarvestingBatchItem = ({ batchItem }) => {
  console.log("batchItem", batchItem);
  if (!batchItem) return null;

  const { quantity, cropVarietyName, plcvCount } = harvestingBatchItemData({
    batchItem,
  });

  return (
    <div className=" p-1 px-2" key={uuid()}>
      <p>Varijetnta: {cropVarietyName}</p>
      <p>Količina: {quantity}</p>

      <p>Broj ubranih polja: {plcvCount}</p>
    </div>
  );
};
