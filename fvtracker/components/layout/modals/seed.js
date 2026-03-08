"use client";

import { FieldGrid } from "@/components/cultivation/fields/preview/grid";
import Modal, { ModalFooter } from "./modal";
import { showDate } from "@/lib/utils/display";
import { useEffect, useState } from "react";
import utils from "@/lib/utils";

export const SeedingModal = ({
  isOpen,
  onCancel,
  cultivation,
  crops,
  caDims,
  cultivationCells,
}) => {
  const [dragEvent, setDragEvent] = useState(null);
  const [toPlantCells, setToPlantCells] = useState([]);
  const [isBeginSelected, setIsBeginSelected] = useState(false);

  useEffect(() => {
    console.log("To plant cells:", toPlantCells);
  }, [toPlantCells]);

  const handleNotPlanted = (x, y) => {
    if (isBeginSelected && toPlantCells?.length > 0) {
      onEndCoordinates(x, y);
    } else {
      setIsBeginSelected(true);
      setToPlantCells((prev) => [...prev, `${x},${y}`]);
    }
  };

  const onEndCoordinates = (x, y) => {
    console.log("on end");
    const { planted } = utils.cultivation.cultivationAreas.getCellsInRect({
      beginX: parseInt(toPlantCells[0].split(",")[0]),
      beginY: parseInt(toPlantCells[0].split(",")[1]),
      endX: x,
      endY: y,
      toPlantCells: toPlantCells,
    });
    console.log("Planted cells in rect:", planted);
    console.log("Existing toPlantCells before adding new ones:", toPlantCells);
    if (!planted) {
      reset();
      return;
    }
    setToPlantCells((prev) => [...prev, ...planted]);
  };

  const handleDrag = (x, y) => {
    if (isBeginSelected) {
      setToPlantCells((prev) => [...prev, { x, y }]);
    }
  };

  const reset = () => {
    setToPlantCells([]);
    setIsBeginSelected(false);
    setDragEvent(null);
  };

  return (
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
            toPlantCells={toPlantCells}
            handleNotPlanted={handleNotPlanted}
          />
        </div>
      </div>
      <ModalFooter>
        <div className={`btn submitButton`}>Submit</div>
        <div className="btn cancelButton">Cancel</div>
      </ModalFooter>
    </Modal>
  );
};
