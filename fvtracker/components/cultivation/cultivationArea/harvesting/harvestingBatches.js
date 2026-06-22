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

  const togglePlansOpen = (fieldName) => {
    setPlansOpen((prev) => (prev === fieldName ? "" : fieldName));
  };

  if (!harvestingBatches) return <LoadingFullScreen />;
  if (Object.keys(harvestingBatches).length === 0)
    return (
      <div className="p-4 text-center text-gray-500">Nema žetvi za prikaz</div>
    );
  return (
    <div className="flex flex-col gap-4">
      <h1 className="border-b-2 font-bold text-3xl">Žetve</h1>
      <div className="flex flex-col gap-4">
        {Object.keys(harvestingBatches).map((fieldName) => (
          <div key={uuid()}>
            <div
              onClick={() => togglePlansOpen(fieldName)}
              className="flex flex-col justify-between border p-4 rounded-lg gap-4 cursor-pointer"
            >
              <h2 className="font-semibold text-xl">Polje: {fieldName}</h2>

              {plansOpen === fieldName && (
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
  if (Object.keys(harvestingPlans).length === 0)
    return (
      <div className="p-4 text-center text-gray-500">
        Nema žetvi za ovo polje
      </div>
    );
  return (
    <>
      <div className="flex flex-col gap-4 mt-4">
        {Object.keys(harvestingPlans).map((planName) => (
          <div className="border p-4" key={uuid()}>
            <p>Plan berbe: {planName}</p>
            <p>Žetva: {harvestingPlans[planName]?.name}</p>
            <p className="mt-2">Stavke žetve:</p>
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
  if (!batchItem) return null;

  const { quantity, batchItemString, plcvCount } = harvestingBatchItemData({
    batchItem,
  });

  return (
    <div className=" p-1 px-2" key={uuid()}>
      <p>{batchItemString}</p>
      <p>Količina u žetvi: {quantity}</p>

      <p>Broj ubranih polja: {plcvCount}</p>
    </div>
  );
};
