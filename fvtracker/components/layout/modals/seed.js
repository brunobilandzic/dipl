"use client";

import { FieldGrid } from "@/components/cultivation/fields/preview/grid";
import Modal, { ModalFooter } from "./modal";
import { showDate } from "@/lib/utils/display";
import { useEffect, useState } from "react";
import utils from "@/lib/utils";
import { MenuModal } from "./menu";
import {
  END_PLANTING,
  CONTINUE_PLANTING,
} from "@/lib/constants/cultivation/plants";
import Modals from ".";

export const SeedingModal = ({
  isOpen,
  onCancel,
  cultivation,
  crops,
  caDims,
  cultivationCells,
}) => {
  const [dragEvent, setDragEvent] = useState(null);

  const [newPlantage, setNewPlantage] = useState(
    initialNewPlantage(cultivation?.id),
  );
  const isBeginSelected = () =>
    !!(
      typeof newPlantage.beginX === "number" &&
      typeof newPlantage.beginY === "number"
    );
  const [chooseNewEnd, setChooseNewEnd] = useState(initialChooseNewEnd);

  useEffect(() => {
    console.log("newPlantage state:", newPlantage);
  }, [newPlantage]);

  useEffect(() => {
    console.log("choicenewend state:", chooseNewEnd);
  }, [chooseNewEnd]);

  const turnOffBeginSelection = () => {
    setNewPlantage((prev) => ({ ...prev, beginX: null, beginY: null }));
  };
  const emptyToPlantCells = () => {
    setNewPlantage((prev) => ({ ...prev, toPlantCells: [] }));
  };
  const showChooseNewEnd = ({ x, y }) => {
    setChooseNewEnd((prev) => ({ ...prev, isOpen: true, choice: null, x, y }));
  };

  const handleNotPlanted = (x, y) => {
    if (isBeginSelected() && newPlantage.toPlantCells?.length > 0) {
      showChooseNewEnd({
        x,
        y,
      });
    } else {
      onBeginCoordinates({ x, y });
    }
  };

  const onBeginCoordinates = ({ x, y }) => {
    setNewPlantage((prev) => ({
      ...prev,
      beginX: x,
      beginY: y,
      toPlantCells: [`${x},${y}`],
    }));
  };

  const onEndCoordinates = ({ x, y }) => {
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

  const handleDrag = ({ x, y }) => {
    if (isBeginSelected()) {
      setNewPlantage((prev) => ({
        ...prev,
        toPlantCells: [...prev.toPlantCells, `${x},${y}`],
      }));
    }
  };

  const reset = () => {
    setNewPlantage(initialNewPlantage(cultivation?.id));
    setDragEvent(null);
    setChooseNewEnd(initialChooseNewEnd);
  };

  const choiceOptions = [
    {
      label: END_PLANTING,
      onClick: () => {
        setChooseNewEnd({ isOpen: false, choice: END_PLANTING });
        onEndCoordinates({
          x: chooseNewEnd.x,
          y: chooseNewEnd.y,
        });
      },
    },
    {
      label: CONTINUE_PLANTING,
      onClick: () => {
        setChooseNewEnd({ isOpen: false, choice: CONTINUE_PLANTING });
      },
    },
    {
      label: "Cancel",
      onClick: () => {
        reset();
      },
      className: "btn w-full cancelButton",
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
      <MenuModal
        invertColor="true"
        isOpen={chooseNewEnd.isOpen}
        options={choiceOptions}
        onCancel={reset}
      />
    </>
  );
};

const PlantCultivation = () => {
  return <Modals.FormModal />;
};

const initialChooseNewEnd = {
  isOpen: false,
  choice: null,
  x: null,
  y: null,
};

const initialNewPlantage = (cultivationId) => ({
  cultivation: cultivationId || null,
  cropVarietyId: null,
  toPlantCells: [],
  name: "",
  plantedAt: null,
  harvestedAt: null,
  beginX: null,
  beginY: null,
  endX: null,
  endY: null,
});
