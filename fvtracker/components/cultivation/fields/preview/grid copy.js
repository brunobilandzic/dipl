"use client";

import constants from "@/lib/constants";
import utils from "@/lib/utils";
import { useEffect, useState } from "react";
import classNames from "classnames";

export function FieldGrid({
  width: fieldWidth,
  length: fieldLength,
  cultivationAreas,
  small,
  plantedCells,
  handleCellClick,
  selectedCultivationArea,
}) {
  if (small) {
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

const FieldCell = ({
  active,
  small,
  x,
  y,
  handleCellClick,
  selected,
  setSelectedCell,
}) => {
 
  const cellClass = classNames(
  small ? "w-1 h-1" : "w-3 h-3 cursor-pointer",
  selected ? `bg-green-500` : active ? `bg-yellow-500` : "",
  "border",
);

  return (
    <div      className={cellClass}
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
