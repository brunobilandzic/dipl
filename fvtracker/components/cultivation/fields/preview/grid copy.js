"use client";

import constants from "@/lib/constants";
import utils from "@/lib/utils";
import { useEffect, useState } from "react";

export function FieldGrid({
  width: fieldWidth,
  length: fieldLength,
  cultivationAreas,
  small,
  plantedCells,
  handleCellClick,
  selectedCultivationArea,
}) {
  console.log("SCA", selectedCultivationArea?.name);

  if (small) {
    console.log(
      "Rendering small grid with width:",
      fieldWidth,
      "and length:",
      fieldLength,
    );
    return (
      <div
        className={`grid justify-start items-start`}
        style={{
          gridTemplateColumns: `repeat(${fieldWidth}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${fieldLength}, minmax(0, 1fr))`,
        }}
      >
        {"grid iz liste.."}
      </div>
    );
  }

  return (
    <>
      <div
        className={`grid justify-start items-start`}
        style={{
          gridTemplateColumns: `repeat(${fieldWidth}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${fieldLength}, minmax(0, 1fr))`,
        }}
      >
        <FieldCells
          cultivationAreas={cultivationAreas}
          fieldWidth={fieldWidth}
          fieldLength={fieldLength}
          small={small}
          handleCellClick={handleCellClick}
          plantedCells={plantedCells}
          selectedCultivationArea={selectedCultivationArea}
        />
      </div>
    </>
  );
}

const FieldCell = ({ active, small, x, y, handleCellClick, selected, setSelectedCell }) => {
  return (
    <div
      className={`${small ? "w-1 h-1" : `w-3 h-3 cursor-pointer `} border ${active ? "bg-yellow-500" : ""} ${selected ? `bg-green-200` : ""}`}
      title={`(${x}, ${y})`}
      onClick={() => {
       handleCellClick({ x, y });
      }}
    ></div>
  );
};

const FieldCells = ({
  cultivationAreas,
  fieldWidth,
  fieldLength,
  small,
  handleCellClick,
  plantedCells,
  selectedCultivationArea,
}) => {
  const [selectedCell, setSelectedCell] = useState(null);
  let cells = [];

  useEffect(() => {
    console.log(
      "includes",

      selectedCultivationArea
        ? selectedCultivationArea.planted.includes(`11,26`)
        : "no SCA",
    );

    console.log("selected planted:", selectedCultivationArea?.planted);
  }, [selectedCultivationArea]);

  for (let x = 0; x < fieldLength; x++) {
    for (let y = 0; y < fieldWidth; y++) {
      cells.push(
        <FieldCell
          key={`${x}-${y}`}
          fieldWidth={fieldWidth}
          fieldLength={fieldLength}
          small={small}
          x={x}
          y={y}
          setSelectedCell={setSelectedCell}
          active={plantedCells.includes(`${x},${y}`)}
          handleCellClick={handleCellClick}
          selected={selectedCultivationArea?.planted.includes(`${x},${y}`)}
        />,
      );
    }
  }
  return cells;
};
