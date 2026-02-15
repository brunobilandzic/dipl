"use client";

import { useEffect, useState } from "react";
import { FieldGrid } from "./preview/grid";
import utils from "@/lib/utils";

export default function FieldPageComponent({ field }) {
  const {
    name,
    description,
    dimensions: { width, length },
    location: { latitude, longitude },
    cultivationAreas,
    cultivations,
    cultivationAreaDimensions,
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
          cultivationAreaDimensions={cultivationAreaDimensions}
        />
        <div></div>
      </div>
    </>
  );
}

function FieldEditCASPanel({
  width,
  length,
  cultivationAreas,
  cultivationAreaDimensions,
}) {
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
    setSelectedCultivationArea(null);
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
    const { x: beginX, y: beginY } = newCACoordinates.begin;
    const { error, planted } =
      utils.cultivation.cultivationAreas.getCellsInRect(
        beginX,
        beginY,
        endX,
        endY,
        cultivationAreaDimensions,
      );

    if (error) {
      alert(error);
      return;
    }

    setNewCACoordinates({
      ...newCACoordinates,
      end: { x: endX, y: endY },
      planted,
    });
  };

  const handleEmptyClick = (x, y) => {
    if (!isBeginSelected) {
      console.log("setting begin coordinates");
      onBeginCoordinates(x, y);
    } else {
      console.log("setting end coordinates");
      onEndCoordinates(x, y);
    }
  };

  const handleActiveClick = (x, y) => {
    const ca = utils.cultivation.cultivationAreas.getCAForCell(
      cultivationAreas,
      x,
      y,
    );
    setSelectedCultivationArea({
      name: ca.name,
      planted: utils.cultivation.cultivationAreas.getCASCells([ca]),
    });
    resetSelection();
  };

  const onRightClick = () => {
    resetSelection();
  };

  useEffect(() => {
    console.log("newCACoordinates changed", newCACoordinates);
  }, [newCACoordinates]);

  const resetSelection = () => {
    console.log("resetiing cac");
    setNewCACoordinates({});
    setIsBeginSelected(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {JSON.stringify(
          `${newCACoordinates.begin ? `Begin: (${newCACoordinates.begin.x}, ${newCACoordinates.begin.y})` : "No begin selected"}`,
        )}
        <div
          style={{
            width: "full",
            aspectRatio: `${width} / ${length}`,
          }}
        >
          <FieldGrid
            width={width}
            length={length}
            cultivationAreas={cultivationAreas}
            clickedCell={editCultivationAreas ? clickedCell : null}
            setClickedCell={editCultivationAreas ? setClickedCell : null}
            plantedCells={plantedCells}
            selectedCultivationArea={selectedCultivationArea}
            newCACoordinates={newCACoordinates}
            isBeginSelected={isBeginSelected}
            setNewCACoordinates={setNewCACoordinates}
            onRightClick={onRightClick}
            handleActiveClick={handleActiveClick}
            handleEmptyClick={handleEmptyClick}
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
