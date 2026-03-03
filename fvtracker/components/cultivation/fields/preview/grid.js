"use client";

import classNames from "classnames";
import dimensionError from "@/lib/constants/errors/cultivation/dimensions";
import utils from "@/lib/utils";

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
  cultivationCells,
  selectedCultivationName
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
          potentialCUCells={potentialCUCells}
          cultivationCells={cultivationCells}
          selectedCultivationName={selectedCultivationName}
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
  potentialCUCells,
  cultivationCells,
  selectedCultivationName
}) => {
  let cells = [];

  const isSelected = (x, y) => {
    const coord = `${x},${y}`;
    if (small) return false;
    return (
      selectedCultivationArea?.planted?.includes(coord) ||
      (newCACoordinates?.planted?.includes(coord) && isBeginSelected) ||
      potentialCUCells?.includes(coord)
    );
  };

  for (let y = 0; y < fieldLength; y++) {
    for (let x = 0; x < fieldWidth; x++) {
      let color = "";
      if (cultivationCells) {
        color = utils.display.plCvColor({
          plCvs: cultivationCells,
          cell: `${x},${y}`,
        });
      }
      cells.push(
        <FieldCell
          key={`${x}-${y}`}
          small={small}
          color={color}
          x={x}
          y={y}
          active={plantedCells?.includes(`${x},${y}`)}
          selected={isSelected(x, y)}
          onRightClick={onRightClick}
          handleEmptyClick={handleEmptyClick}
          handleActiveClick={handleActiveClick}
          isBeginSelected={isBeginSelected}
          enlarged={enlarged}
          cultivationName={
            cultivationCells
              ? utils.cultivation.cultivations.getCultivationNameForCell({
                  cultivationCells,
                  cell: `${x},${y}`,
                })
              : null
          }
          selectedCultivationName={selectedCultivationName}
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
  color,
  onRightClick,
  handleEmptyClick,
  handleActiveClick,
  isBeginSelected,
  enlarged,
  cultivationName,
  selectedCultivationName
}) => {
  const cellClass = classNames(
    small ? "w-1 h-1" : enlarged ? "w-6 h-6" : "w-3 h-3",
    selected ? `bg-green-500` : active ? `bg-yellow-500` : "",
    "border cursor-pointer",
    color,
    cultivationName === selectedCultivationName ? "ring-2 ring-blue-500" : "",
  );
  const handleClick = (e) => {
    if (!active && color === "") {
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
      title={cultivationName ?`(${x}, ${y}) - ${cultivationName}` : `(${x}, ${y})`}
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();
      }}
    ></div>
  );
};
