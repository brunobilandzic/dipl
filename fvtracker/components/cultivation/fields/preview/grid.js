"use client";

import classNames from "classnames";
import dimensionError from "@/lib/constants/errors/cultivation/dimensions";
import utils from "@/lib/utils";
import colors from "@/lib/constants/cultivation/colors";

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
  selectedCultivationName,
  cuCellsFieldCoords = false,
  invertColor = false,
  seedMode = false,
  toPlantCells = [],
  handleNotPlanted,
  hanleCropVarietyClick,
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
          cuCellsFieldCoords={cuCellsFieldCoords}
          cultivationCells={cultivationCells}
          invertColor={invertColor}
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
          cuCellsFieldCoords={cuCellsFieldCoords}
          selectedCultivationName={selectedCultivationName}
          invertColor={invertColor}
          seedMode={seedMode}
          toPlantCells={toPlantCells}
          handleNotPlanted={handleNotPlanted}
          hanleCropVarietyClick={hanleCropVarietyClick}
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
  selectedCultivationName,
  cuCellsFieldCoords,
  invertColor,
  seedMode,
  toPlantCells,
  handleNotPlanted,
  hanleCropVarietyClick,
}) => {
  let cells = [];

  const isSelected = (x, y) => {
    if (small) return false;
    const coord = `${x},${y}`;
    return (
      selectedCultivationArea?.planted?.includes(coord) ||
      (newCACoordinates?.planted?.includes(coord) && isBeginSelected) ||
      potentialCUCells?.includes(coord) ||
      toPlantCells?.includes(coord)
    );
  };

  for (let y = 0; y < fieldLength; y++) {
    for (let x = 0; x < fieldWidth; x++) {
      let color = "";
      let cropVariety = null;
      if (cultivationCells?.length > 0) {
        ({ color, cropVariety } = utils.display.cvAndColor({
          plCvs: cultivationCells,
          cell: `${x},${y}`,
          fieldView: cuCellsFieldCoords,
        }));
      }

      const cultivationName =
        cultivationCells?.length > 0
          ? utils.cultivation.cultivations.getCultivationNameForCell({
              cultivationCells,
              cell: `${x},${y}`,
            })
          : null;

      const handleClick = (e) => {
        e.stopPropagation();
        if (active) {
          handleActiveClick(x, y);
          return;
        }
        if (seedMode && !cropVariety) {
          handleNotPlanted(x, y);
          return;
        }
        if (seedMode && cropVariety) {
          return hanleCropVarietyClick(cropVariety);
        }
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

      const active = plantedCells?.includes(`${x},${y}`);

      const getTitle = () => {
        if (cropVariety && seedMode) {
          return `(${x}, ${y}) - ${cropVariety?.cropType?.name} ${cropVariety?.name}`;
        }
        if (cropVariety) {
          return `(${x}, ${y}) - ${cultivationName} -  ${cropVariety?.cropType?.name} ${cropVariety?.name}`;
        }
        if (seedMode && cultivationName && !cropVariety) {
          return `(${x}, ${y}) - ${cultivationName} - Not planted`;
        }
        if (seedMode) {
          return ``;
        }
        if (cultivationName && !cropVariety) {
          return `(${x}, ${y}) - ${cultivationName} - Not planted`;
        }
        if (cultivationName) {
          return `(${x}, ${y}) - ${cultivationName}`;
        }
        return `(${x}, ${y})`;
      };

      const isDisabled = () => {
        if (seedMode && !cultivationName) return true;
        return false;
      };

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
          cultivationName={cultivationName}
          selectedCultivationName={selectedCultivationName}
          invertColor={invertColor}
          seedMode={seedMode}
          handleNotPlanted={handleNotPlanted}
          title={getTitle()}
          handleClick={handleClick}
          disabled={isDisabled()}
        />,
      );
    }
  }
  return cells;
};

const FieldCell = ({
  active,
  small,
  selected,
  color,
  onRightClick,
  enlarged,
  cultivationName,
  selectedCultivationName,
  invertColor,
  title,
  handleClick,
  disabled,
}) => {
  const bgClass = selected
    ? "bg-green-500"
    : color || (active ? "bg-yellow-500" : "");
  const cellClass = classNames(
    small ? "w-1 h-1" : enlarged ? "w-6 h-6" : "w-3 h-3",
    "border cursor-pointer",
    invertColor ? "border border-[var(--background)]" : "",
    bgClass,
    cultivationName === selectedCultivationName ? "ring-2 ring-blue-500" : "",
    disabled ? "cursor-not-allowed opacity-50 bg-gray-500" : "",
  );

  return (
    <div
      className={cellClass}
      title={title}
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();
      }}
    ></div>
  );
};
