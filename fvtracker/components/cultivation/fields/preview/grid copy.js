"use client";

import constants from "@/lib/constants";
import utils from "@/lib/utils";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loading";

export function FieldGrid({
  width: fieldWidth,
  length: fieldLength,
  cultivationAreas,
  small,
  plantedCells,
  selectedCultivationArea,
  newCACoordinates,
  isBeginSelected,
  setNewCACoordinates,
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
          handleActiveClick={handleActiveClick}
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
  const [selectedCell, setSelectedCell] = useState(null);
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
            selectedCultivationArea?.planted?.includes(`${x},${y}`) ||
            (newCACoordinates.planted?.includes(`${x},${y}`) && isBeginSelected)
          }
          onRightClick={onRightClick}
          handleEmptyClick={handleEmptyClick}
          handleActiveClick={handleActiveClick}
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
}) => {
  const dispatch = useDispatch(); 
  const cellClass = classNames(
    small ? "w-1 h-1" : "w-3 h-3 cursor-pointer",
    selected ? `bg-green-500` : active ? `bg-yellow-500` : "",
    "border",
  );
  const handleClick = (e) => {
    dispatch(setLoading(true));
    if (!active) {
      handleEmptyClick(x, y);
      dispatch(setLoading(false));
      return;
    }
    handleActiveClick({ x, y });
    dispatch(setLoading(false));
  };
  return (
    <div
      className={cellClass}
      title={`(${x}, ${y})`}
      onClick={handleClick}
      onContextMenu={(e) => {
        console.log(onRightClick);
        e.preventDefault();
        onRightClick();
      }}
    ></div>
  );
};
