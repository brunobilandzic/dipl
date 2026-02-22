"use client";

import classNames from "classnames";
import dimensionError from "@/lib/constants/errors/cultivation/dimensions";

export function FieldGrid({
  width: fieldWidth,
  length: fieldLength,
  cultivationAreas,
  small,
  plantedCells,
  selectedCultivationArea,
  newCACoordinates,
  isBeginSelected,
  onRightClick,
  handleEmptyClick,
  handleActiveClick,
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
          cultivationAreas={cultivationAreas}
          fieldWidth={fieldWidth}
          fieldLength={fieldLength}
          small={small}
          plantedCells={plantedCells}
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
        }}
      >
        <FieldCells
          cultivationAreas={cultivationAreas}
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
}) => {
  let cells = [];
  for (let x = 0; x < fieldLength; x++) {
    for (let y = 0; y < fieldWidth; y++) {
      cells.push(
        <FieldCell
          key={`${x}-${y}`}
          small={small}
          x={x}
          y={y}
          active={plantedCells.includes(`${x},${y}`)}
          selected={
            !small &&
            (selectedCultivationArea?.planted?.includes(`${x},${y}`) ||
              (newCACoordinates.planted?.includes(`${x},${y}`) &&
                isBeginSelected))
          }
          onRightClick={onRightClick}
          handleEmptyClick={handleEmptyClick}
          handleActiveClick={handleActiveClick}
          isBeginSelected={isBeginSelected}
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
}) => {

  const cellClass = classNames(
    small ? "w-1 h-1" : "w-3 h-3 cursor-pointer",
    selected ? `bg-green-500` : active ? `bg-yellow-500` : "",
    "border",
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
