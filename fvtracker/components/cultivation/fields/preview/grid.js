"use client";

export function FieldGrid({
  width: fieldWidth,
  length: fieldLength,
  cultitioAreas,
  small,
}) {
  return (
    <>
      <div className={`grid grid-cols-[repeat(100,minmax(0,1fr))] w-full`}>
        {buildFieldCells(fieldWidth, fieldLength, small)}
      </div>
    </>
  );
}

const FieldCell = ({ fieldWidth, fieldLength, active, small }) => {
  return <div className={`${small && "w-1 h-1"} border `}></div>;
};

const buildFieldCells = (fieldWidth, fieldLength, small) => {
  const cells = [];
  for (let i = 0; i < fieldWidth * fieldLength; i++) {
    cells.push(
      <FieldCell
        key={i}
        fieldWidth={fieldWidth}
        fieldLength={fieldLength}
        small={small}
      />,
    );
  }
  return cells;
};
