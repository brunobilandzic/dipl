"use client";
import { LoadingFullScreen } from "@/components/layout/loading";
import { harvestingBatchesFields } from "@/lib/utils/cultivation/plant/harvest";
import { harvestingBatchItemData } from "@/lib/utils/cultivation/plant/harvestingBatches";
import { AppTable } from "@/components/layout/preview/table";
import { VARIETIES_QUALITIES } from "@/lib/constants/cultivation/plants";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

export default function HarvestingBatchesFields() {
  const fields = useSelector((state) => state.cultivation.fields);
  const [harvestingBatches, setHarvestingBatches] = useState(null);
  const [plansOpen, setPlansOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [qualityFilter, setQualityFilter] = useState("all");

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
      <div className="flex flex-wrap gap-3 items-end">
        <div className="inputRow mb-0">
          <label className="label">Pretraži sortu</label>
          <input
            className="inputText"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Naziv sorte..."
          />
        </div>
        <div className="inputRow mb-0">
          <label className="label">Kvaliteta</label>
          <select
            className="inputText"
            value={qualityFilter}
            onChange={(e) => setQualityFilter(e.target.value)}
          >
            <option value="all">Sve</option>
            {VARIETIES_QUALITIES.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {Object.keys(harvestingBatches).map((fieldName) => (
          <div key={uuid()}>
            <div
              onClick={() => togglePlansOpen(fieldName)}
              className="card flex flex-col justify-between gap-4 cursor-pointer"
            >
              <h2 className="font-semibold text-xl">Polje: {fieldName}</h2>

              {plansOpen === fieldName && (
                <HarvestingBatches
                  harvestingPlans={harvestingBatches[fieldName]}
                  search={search}
                  qualityFilter={qualityFilter}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const HarvestingBatches = ({ harvestingPlans, search, qualityFilter }) => {
  if (Object.keys(harvestingPlans).length === 0)
    return (
      <div className="p-4 text-center text-gray-500">
        Nema žetvi za ovo polje
      </div>
    );
  return (
    <div className="flex flex-col gap-4 mt-4">
      {Object.keys(harvestingPlans).map((planName) => {
        const items = harvestingPlans[planName]?.harvestingBatchItems || [];
        const rows = items.map((batchItem) => {
          const { name, quality, quantity, plcvCount } =
            harvestingBatchItemData({ batchItem });
          return { name, quality, quantity, plcvCount };
        });
        const filteredRows = rows.filter(
          (row) =>
            (qualityFilter === "all" || row.quality === qualityFilter) &&
            row.name.toLowerCase().includes((search || "").toLowerCase()),
        );
        return (
          <div
            className="border border-gray-200 p-4 rounded-lg bg-white"
            key={uuid()}
          >
            <p className="font-semibold mb-2">Žetva: {harvestingPlans[planName]?.name}</p>
            <AppTable
              headerLabels={[
                "Naziv",
                "Kvaliteta",
                "Količina",
                "Broj ubranih polja",
              ]}
              rows={filteredRows}
              emptyRowsLabel="Nema stavki žetve"
            />
          </div>
        );
      })}
    </div>
  );
};
