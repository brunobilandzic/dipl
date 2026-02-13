"use client";

import { useEffect, useState } from "react";
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
  const [plantedCells, setPlantedCells] = useState(
    cultivationAreas
      ? utils.cultivation.cultivationAreas.getCASCells(cultivationAreas)
      : [],
  );
  const [clickedCell, setClickedCell] = useState(null);
  const [selectedCultivationArea, setSelectedCultivationArea] = useState(null);
  const [newCACoordinates, setNewCACoordinates] = useState({});
  const [isBeginSelected, setIsBeginSelected] = useState(false);

  const onBeginCoordinates = (beginX, beginY) => {
    setIsBeginSelected(true);
    setNewCACoordinates({
      ...newCACoordinates,
      begin: { x: beginX, y: beginY },
      planted: [`${beginX},${beginY}`],
    });
  };

  const onEndCoordinates = (endX, endY) => {
    if (!newCACoordinates.begin) {
      console.error("Begin coordinates not set");
      return;
    }
    const {x: beginX, y: beginY} = newCACoordinates.begin;
    const newPlantedCells = utils.cultivation.cultivationAreas.getCellsInRect(
      beginX,
      beginY,
      endX,
      endY,
    );
    setNewCACoordinates({
      ...newCACoordinates,
      end: { x: endX, y: endY },
      planted: newPlantedCells,
    });
  }

  const handleCellClick = ({ x, y }) => {
    const coordinates = `${x},${y}`;

    if (
      utils.cultivation.cultivationAreas
        .getCASCells(cultivationAreas)
        .includes(coordinates)
    ) {
      const ca = utils.cultivation.cultivationAreas.getCAForCell(
        cultivationAreas,
        x,
        y,
      );
      setSelectedCultivationArea({
        name: ca.name,
        planted: utils.cultivation.cultivationAreas.getCASCells([ca]),
      });
      setIsBeginSelected(false);
      console.log("selected", ca?.name);
    } else {
      console.log(
        "empty cell clicked, beginning cultivation area creation",
        coordinates,
      );
      setSelectedCultivationArea(null);
      if (!isBeginSelected) {
        onBeginCoordinates(x, y);
      } else {
        onEndCoordinates(x, y);
      }
    }
  };

  const onRightClick = () => {
    console.log("right click, resetting cultivation area creation");
    setNewCACoordinates({});
    setIsBeginSelected(false);
  };

  useEffect(() => {
    console.log("newCACoordinates changed", newCACoordinates);
  }, [newCACoordinates]); 

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
            plantedCells={plantedCells}
            handleCellClick={handleCellClick}
            selectedCultivationArea={selectedCultivationArea}
            newCACoordinates={newCACoordinates}
            isBeginSelected={isBeginSelected}
            setNewCACoordinates={setNewCACoordinates}
            onRightClick={onRightClick}
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
