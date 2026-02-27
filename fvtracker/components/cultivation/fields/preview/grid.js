"use client";

import classNames from "classnames";
import dimensionError from "@/lib/constants/errors/cultivation/dimensions";

export function FieldGrid({
  width: fieldWidth,
  length: fieldLength,
  small,
  plantedCells,
  selectedCultivationArea,
  newCACoordinates,
  isBeginSelected,
  onRightClick,
  handleEmptyClick,
  handleActiveClick,
  enlarged,
  potentialCUCells,
  cultivatedCells,
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
        <FieldCells
          fieldWidth={fieldWidth}
          fieldLength={fieldLength}
          small={small}
          plantedCells={plantedCells}
          enlarged={enlarged}
        />
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
          aspectRatio: `${fieldWidth} / ${fieldLength}`,
        }}
      >
        <FieldCells
          fieldWidth={fieldWidth}
          fieldLength={fieldLength}
          small={small}
          plantedCells={plantedCells}
          selectedCultivationArea={selectedCultivationArea}
          newCACoordinates={newCACoordinates}
          isBeginSelected={isBeginSelected}
          onRightClick={onRightClick}
          handleEmptyClick={handleEmptyClick}
          handleActiveClick={handleActiveClick}
          enlarged={enlarged}
          cultivatedCells={cultivatedCells}
          potentialCUCells={potentialCUCells}
        />
      </div>
    </>
  );
}

const FieldCells = ({
  fieldWidth,
  fieldLength,
  small,
  plantedCells,
  selectedCultivationArea,
  newCACoordinates,
  isBeginSelected,
  onRightClick,
  handleEmptyClick,
  handleActiveClick,
  enlarged,
  cultivatedCells,
  potentialCUCells,
}) => {
  let cells = [];

  const isSelected = (x, y) => {
    const coord = `${x},${y}`;
    if (small) return false;
    return (
      selectedCultivationArea?.planted?.includes(coord) ||
      (newCACoordinates?.planted?.includes(coord) && isBeginSelected) ||
      potentialCUCells?.includes(coord) ||
      cultivatedCells?.includes(coord)
    );
  };

  for (let y = 0; y < fieldLength; y++) {
    for (let x = 0; x < fieldWidth; x++) {
      cells.push(
        <FieldCell
          key={`${x}-${y}`}
          small={small}
          x={x}
          y={y}
          active={plantedCells?.includes(`${x},${y}`)}
          selected={isSelected(x, y)}
          onRightClick={onRightClick}
          handleEmptyClick={handleEmptyClick}
          handleActiveClick={handleActiveClick}
          isBeginSelected={isBeginSelected}
          enlarged={enlarged}
        />,
      );
    }
  }
  return cells;
};

const FieldCell = ({
  active,
  small,
  x,
  y,
  selected,
  onRightClick,
  handleEmptyClick,
  handleActiveClick,
  isBeginSelected,
  enlarged,
}) => {
  const cellClass = classNames(
    small ? "w-1 h-1" : enlarged ? "w-6 h-6" : "w-3 h-3",
    selected ? `bg-green-500` : active ? `bg-yellow-500` : "",
    "border cursor-pointer",
  );
  const handleClick = (e) => {
    if (!active) {
      handleEmptyClick(x, y);
      return;
    }
    if (isBeginSelected) {
      alert(dimensionError.CULTIVATION_AREA_OVERLAP);
      return;
    }
    handleActiveClick(x, y);
  };
  return (
    <div
      className={cellClass}
      title={`(${x}, ${y})`}
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();
      }}
    ></div>
  );
};
