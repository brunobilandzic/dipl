"use client";

import { FieldGrid } from "@/components/cultivation/fields/preview/grid";
import Modal, { ModalFooter } from "./modal";
import { showDate } from "@/lib/utils/display";
import { useState } from "react";

export const SeedingModal = ({
  isOpen,
  onCancel,
  cultivation,
  crops,
  caDims,
  cultivationCells,
}) => {
  console.log("isopnen:", isOpen);
  console.log("cultivation:", cultivation);
  console.log("ccells:", cultivationCells);
  if (!cultivation || !isOpen) return null;
  const [dragEvent, setDragEvent] = useState(null);
  const [selected, setSelected] = useState([]);
  const [isBeginSelected, setIsBeginSelected] = useState(false);

  const handleClick = (x, y) => {
    if (isBeginSelected) {
  
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
