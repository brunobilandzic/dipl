"use client";

import { useState } from "react";
import { FieldGrid } from "./preview/grid";

export default function FieldPageComponent({ field }) {
  const {
    name,
    description,
    dimensions: { width, length },
    location: { latitude, longitude },
    cultivationAreas,
    cultivations,
    cultivationAreaDimensions: {
      min_ca_dim,
      max_ca_dim,
      gap: cultivationAreasGap,
    },
    slug,
  } = field;
  const [editCultivationAreas, setEditCultivationAreas] = useState(false);

  return (
    <>
      <div className="w-full grid grid-cols-1 gap-4">
        <div className="text-3xl font-bold">{name}</div>
        <div className="italic">{description}</div>
        <FieldEditCASPanel
          setEditCultivationAreas={setEditCultivationAreas}
          editCultivationAreas={editCultivationAreas}
          width={width}
          length={length}
          cultivationAreas={cultivationAreas}
        />
        <div></div>
      </div>
    </>
  );
}

function FieldEditCASPanel({
  setEditCultivationAreas: setEdit,
  editCultivationAreas: edit,
  width,
  length,
  cultivationAreas,
}) {
  const [selectedCultivationArea, setSelectedCultivationArea] = useState(null);

  return (
    <>
      <div className="flex flex-col gap-4">
        {cultivationAreas.length }
        <div>
          <FieldGrid
            width={width}
            length={length}
            cultivationAreas={cultivationAreas}
          />
        </div>
        <div
          className=" btn cursor-pointer"
          onClick={() => setEdit((prev) => !prev)}
        >
          {edit ? "Submit cultivation areas" : "Edit cultivation areas"}
        </div>
      </div>
    </>
  );
}
