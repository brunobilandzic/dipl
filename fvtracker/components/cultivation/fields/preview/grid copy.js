"use client";

import utils from "@/lib/utils";

export function FieldGrid({
  width: fieldWidth,
  length: fieldLength,
  cultivationAreas,
  small,
  plantedCells,
  handleCellClick,
}) {
  console.log("FieldGrid Called") // Log first 10 for brevity
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
        })}
      </div>
    </>
  );
}

const FieldCell = ({ active, small, x, y, handleCellClick }) => {
  return (
    <div
      className={`${small ? "w-1 h-1" : `w-3 h-3 cursor-pointer `} border ${active ? "bg-yellow-500" : ""} `}
      title={`(${x}, ${y})`}
      onClick={() => handleCellClick && handleCellClick(x, y)}
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
}) => {
  console.log("Planted cells:", plantedCells); // Log first 10 for brevity

  let cells = [];

  for (let i = 0; i < fieldLength; i++) {
    for (let j = 0; j < fieldWidth; j++) {
      cells.push(
        <FieldCell
          key={`${i}-${j}`}
          fieldWidth={fieldWidth}
          fieldLength={fieldLength}
          small={small}
          x={i}
          y={j}
          active={plantedCells.includes(`${i},${j}`)}
          handleCellClick={handleCellClick}
        />,
      );
    }
  }
  return cells;
};
