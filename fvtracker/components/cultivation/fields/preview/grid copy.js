"use client";

import constants from "@/lib/constants";
import utils from "@/lib/utils";
import { useEffect } from "react";

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
  console.log("FieldGrid Called"); // Log first 10 for brevity
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
        {buildFieldCells(cultivationAreas, fieldWidth, fieldLength, small)}
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
        {buildFieldCells({
          cultivationAreas,
          fieldWidth,
          fieldLength,
          small,
          handleCellClick,
          plantedCells,
          selectedCultivationArea,
        })}
      </div>
    </>
  );
}

const FieldCell = ({ active, small, x, y, handleCellClick, selected }) => {
  return (
    <div
      className={`${small ? "w-1 h-1" : `w-3 h-3 cursor-pointer `} border ${active ? "bg-yellow-500" : ""} ${selected ? `bg-green-200` : ""}`}
      title={`(${x}, ${y})`}
      onClick={() => {
        console.log("Cell clicked at:", `${x},${y}`);
        handleCellClick(x, y);
      }}
    ></div>
  );
};

const buildFieldCells = ({
  cultivationAreas,
  fieldWidth,
  fieldLength,
  small,
  handleCellClick,
  plantedCells,
  selectedCultivationArea,
}) => {
  let cells = [];

  useEffect(() => {

   /*  console.log(
    "includes",

    selectedCultivationArea
      ? utils.cultivation.cultivationAreas.CAIncludesCell(
          selectedCultivationArea,
          5,
          5,
        )
      : "no SCA",
  );
 */

console.log("selected planted:",selectedCultivationArea?.planted)
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
          active={plantedCells.includes(`${x},${y}`)}
          handleCellClick={handleCellClick}
          selected={false}
        />,
      );
    }
  }
  return cells;
};
