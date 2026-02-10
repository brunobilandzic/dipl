"use client";

export function FieldGrid({
  width: fieldWidth,
  length: fieldLength,
  cultivationAreas,
  small,
}) {
  console.log("cas", cultivationAreas);
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
  const activeCells = cultivationAreas.reduce((_activeCells, ca) => {
    _activeCells.push(
      ...ca.fieldGridCells.map((cell) => `${cell.column}-${cell.row}`),                 
    );
    return _activeCells;
  }, []);

  const cells = [];
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
          active={activeCells.includes(`${i}-${j}`)}
        />,
      );
    }
  }
  return cells;
};
