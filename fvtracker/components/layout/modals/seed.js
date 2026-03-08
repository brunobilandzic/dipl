"use client";

import {
  FieldGrid,
} from "@/components/cultivation/fields/preview/grid";
import Modal, { ModalFooter } from "./modal";
import { showDate } from "@/lib/utils/display";
import { useEffect, useState } from "react";
import utils from "@/lib/utils";
import { MenuModal } from "./menu";

export const SeedingModal = ({
  isOpen,
  onCancel,
  cultivation,
  crops,
  caDims,
  cultivationCells,
}) => {
  const [dragEvent, setDragEvent] = useState(null);

  const initialNewPlantage = {
    cultivation: cultivation?.id || null,
    cropVarietyId: null,
    toPlantCells: [],
    name: "",
    plantedAt: null,
    harvestedAt: null,
    beginX: null,
    beginY: null,
    endX: null,
    endY: null,
  };
  const [newPlantage, setNewPlantage] = useState(initialNewPlantage);
  const isBeginSelected = () => !!(newPlantage.beginX && newPlantage.beginY);
  const [chooseNewEnd, setChooseNewEnd] = useState({
    isOpen: false,
    choice: null,
  });

  useEffect(() => {
    console.log("choicenewend state:", chooseNewEnd);
  }, [chooseNewEnd]);

  const turnOffBeginSelection = () => {
    setNewPlantage((prev) => ({ ...prev, beginX: null, beginY: null }));
  };
  const emptyToPlantCells = () => {
    setNewPlantage((prev) => ({ ...prev, toPlantCells: [] }));
  };

  const handleNotPlanted = (x, y) => {
    if (isBeginSelected() && newPlantage.toPlantCells?.length > 0) {
      onEndCoordinates(x, y);
    } else {
      onBeginCoordinates(x, y);
    }
  };

  const onBeginCoordinates = (x, y) => {
    setNewPlantage((prev) => ({
      ...prev,
      beginX: x,
      beginY: y,
      toPlantCells: [`${x},${y}`],
    }));
  };

  const onEndCoordinates = (x, y) => {
    const { planted } = utils.cultivation.cultivationAreas.getCellsInRect({
      beginX: newPlantage.beginX,
      beginY: newPlantage.beginY,
      endX: x,
      endY: y,
      toPlantCells: newPlantage.toPlantCells,
      toPlantCultivation: cultivation,
    });
    if (!planted) {
      reset();
      return;
    }
    setNewPlantage((prev) => ({
      ...prev,
      endX: x,
      endY: y,
      toPlantCells: planted,
    }));
  };

  const handleDrag = (x, y) => {
    if (isBeginSelected()) {
      setNewPlantage((prev) => ({
        ...prev,
        toPlantCells: [...prev.toPlantCells, `${x},${y}`],
      }));
    }
  };

  const reset = () => {
    setNewPlantage(initialNewPlantage);
    setDragEvent(null);
  };

  const choiceOptions = [
    {
      label: END_PLANTING,
      onClick: () => {
        setChooseNewEnd({ isOpen: false, choice: END_PLANTING });
        // copilot recomend turnOffBeginSelection();
      },
    },
    {
      label: CONTINUE_PLANTING,
      onClick: () => {
        setChooseNewEnd({ isOpen: false, choice: CONTINUE_PLANTING });
      },
    },
  ];

  if (!cultivation || !isOpen) return null;
  return (
    <>
      <Modal title="Seeding Modal" isOpen={isOpen} onCancel={onCancel}>
        <div className="flex flex-col gap-2">
          <div className="font-bold text-xl">{cultivation?.name || "N/A"}</div>
          <div>{cultivation?.description}</div>
          <div className="text-sm text-gray-500">
            Created at: {showDate(cultivation?.createdAt)} <br />
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
              toPlantCells={newPlantage?.toPlantCells}
              handleNotPlanted={handleNotPlanted}
            />
          </div>
        </div>
        <ModalFooter>
          <div className={`btn submitButton`}>Submit</div>
          <div className="btn cancelButton">Cancel</div>
        </ModalFooter>
      </Modal>
      <MenuModal isOpen={chooseNewEnd.isOpen} options={choiceOptions} />
    </>
  );
};
