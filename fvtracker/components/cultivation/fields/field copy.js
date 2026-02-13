"use client";

import { useState } from "react";
import { FieldGrid } from "./preview/grid copy";
import utils from "@/lib/utils";

export default function FieldPageComponentCopy({ field }) {
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

  return (
    <>
      <div className="w-full grid grid-cols-1 gap-4">
        <div className="text-3xl font-bold">{name}</div>
        <div className="italic">{description}</div>
        <FieldEditCASPanel
          width={width}
          length={length}
          cultivationAreas={cultivationAreas}
        />
        <div></div>
      </div>
    </>
  );
}

function FieldEditCASPanel({ width, length, cultivationAreas }) {
  const [editCultivationAreas, setEditCultivationAreas] = useState(false);
  const [CAPlantedCells, setCAPlantedCells] = useState(
    cultivationAreas
      ? utils.cultivation.cultivationAreas.mapCANamesToPlantedCells(
          cultivationAreas,
        )
      : [],
  );
  const [clickedCell, setClickedCell] = useState(null);
  const [selectedCultivationArea, setSelectedCultivationArea] = useState(null);
  const [newCACoordinates, setNewCACoordinates] = useState({});
  const [isBeginSelected, setIsBeginSelected] = useState(false);

  const onBeginCoordinates = (x, y) => {
    setIsBeginSelected(true);
    console.log("begin", x, y);
    setNewCACoordinates({
      ...newCACoordinates,
      begin: { x, y },
    });
  };

  const handleCellClick = ({ x, y }) => {
    const coordinates = `${x},${y}`;
    for (const [key, value] of Object.entries(CAPlantedCells)) {
      if (value.includes(coordinates)) {
        setSelectedCultivationArea(
          cultivationAreas.find((ca) => ca.name === key),
        );
        return;
      } else {
      }
    }
    console.log("cell not planted, proceeding");
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {JSON.stringify(
          `${newCACoordinates.begin ? `Begin: (${newCACoordinates.begin.x}, ${newCACoordinates.begin.y})` : "No begin selected"}`,
        )}
        <div>
          <FieldGrid
            width={width}
            length={length}
            cultivationAreas={cultivationAreas}
            clickedCell={editCultivationAreas ? clickedCell : null}
            setClickedCell={editCultivationAreas ? setClickedCell : null}
            CAPlantedCells={CAPlantedCells}
            handleCellClick={handleCellClick}
            selectedCultivationArea={selectedCultivationArea}
            
          />
        </div>
        <div
          className=" btn cursor-pointer"
          onClick={() => setEditCultivationAreas((prev) => !prev)}
        >
          {editCultivationAreas
            ? "Submit cultivation areas"
            : "Edit cultivation areas"}
        </div>
      </div>
    </>
  );
}
