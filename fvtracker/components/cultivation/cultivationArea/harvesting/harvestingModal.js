import Modal from "@/components/layout/modals/modal";
import { showDate } from "@/lib/utils/display";
import { useState, useEffect } from "react";
import { FieldGrid } from "../../fields/preview/grid";

export function HarvestingModal({
  isOpen,
  onCancel,
  onConfirm,
  cultivation,
  cultivationCells,
  caDims,
}) {
  const [newHarvest, setNewHarvest] = useState({});
  console.log("HarvestingModal rendered with cultivation:", cultivation);

  // set harvest when cult id
  useEffect(() => {
    if (!cultivation?._id) return;

    setNewHarvest(
      initialNewHarvest_WId
        ? initialNewHarvest_WId({ cultivationId: cultivation?._id })
        : {},
    );
  }, [cultivation?._id]);

  // BEGIN LOGIC

  const isBeginSelected = () =>
    !!(
      typeof newHarvest.beginX === "number" &&
      typeof newHarvest.beginY === "number"
    );

  const handleBeginSelection = ({ x, y }) => {
    setNewHarvest((prev) => ({
      ...prev,
      beginX: x,
      beginY: y,
      toHarvestCells: [...(prev.toHarvestCells ?? []), `${x},${y}`],
    }));
  };

  // RESETING LOGIC

  const reset = () => {
    setNewHarvest(
      initialNewHarvest_WId
        ? initialNewHarvest_WId({ cultivationId: cultivation?._id })
        : {},
    );
  };

  const removeBegin = () => {
    setNewPlantage((prev) => ({
      ...prev,
      beginX: null,
      beginY: null,
    }));
  };

  const handleNotPlanted = (x, y) => {
    alert("Polje nije zasađeno, nije moguće žeti");
  };

  const handleCropVarietyClick = ({ cropVariety, x, y }) => {
    console.log("Clicked on cell with coordinates:", cropVariety, cellCoord);
    /* if (isBeginSelected() && newPlantage.toPlantCells?.length > 0) {
      showChooseNewEnd({
        x,
        y,
      });
    } else {
      onBeginPlantingCoordinates({ x, y });
    } */
  };

  return (
    <>
      <Modal title="Berba" isOpen={isOpen} onCancel={onCancel}>
        <div className="flex flex-col gap-2">
          <div className="font-bold text-xl">{cultivation?.name || "N/A"}</div>
          <div>{cultivation?.description}</div>
          <div className="text-sm text-gray-500">
            Kreirano: {showDate(cultivation?.createdAt)} <br />
          </div>
        </div>
        <div className="mt-4 p-4">
          <div>
            <FieldGrid
              width={caDims.width}
              length={caDims.length}
              invertColor={true}
              cultivationCells={cultivationCells}
              onRightClick={reset}
              seedMode={true}
              toPlantCells={newHarvest?.toHarvestCells}
              handleNotPlanted={handleNotPlanted}
              handleCropVarietyClick={handleCropVarietyClick}
              harvestMode={true}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

const initialChooseNewEnd = {
  isOpen: false,
  choice: null,
  x: null,
  y: null,
};

const initialNewHarvest_WId = ({ cultivationId }) => {
  // we are choosing variaty when clicking on it
  return {
    cultivationId: cultivationId || null,
    variety: {
      _id: null,
      name: null,
    },
    harvestPlan: null,
    toHarvestCells: [],
    harvestedAt: new Date("2026-03-10T00:00:00Z"),
    beginX: null,
    beginY: null,
    endX: null,
    endY: null,
  };
};

const prepareHarvestBody = (newHarvest) => ({
  cultivationId: newHarvest.cultivationId,
  cropVarietyId: newHarvest.variety._id,
  relativeCoords: newHarvest.toHarvestCells,
  harvestedAt: newHarvest.harvestedAt,
  plantingPlanId: newPlantage.plantingPlan?._id,
});
