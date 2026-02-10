"use client";

export function FieldGrid({
  width: fieldWidth,
  length: fieldLength,
  cultivationAreas,
  small,
}) {
  return (
    <>
      <div
        className={`grid`}
        style={{
          gridTemplateColumns: `repeat(${fieldWidth}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${fieldLength}, minmax(0, 1fr))`,
        }}
      >
        {buildFieldCells(cultivationAreas, fieldWidth, fieldLength, small)}
      </div>
    </>
  );
}

const FieldCell = ({ active, small, x, y }) => {
  return (
    <div
      className={`${small ? "w-1 h-1" : "w-2 h-2 cursor-pointer"} border ${active ? "bg-yellow-500" : ""} `}
      title={`(${x}, ${y})`}
    ></div>
  );
};

const buildFieldCells = (cultivationAreas, fieldWidth, fieldLength, small) => {
  const plantedCellsMapsArray = cultivationAreas?.map((ca) => ca.planted);
  const plantedCells =
    plantedCellsMapsArray?.reduce((acc, plantedMap) => {
      return acc.concat(Object.keys(plantedMap));
    }, []) || [];


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
        />,
      );
    }
  }
  return cells;
};
