"use client";

import Modal, { ModalFooter } from "./modal";

export const SeedingModal = ({ isOpen, onCancel, cultivation, crops }) => {
  console.log("isopnen:", isOpen);
  console.log("cultivation:", cultivation);
  return (
    <Modal title="Seeding Modal" isOpen={isOpen} onCancel={onCancel}>
      <div className="flex flex-col gap-2">
        <div className="font-bold text-xl">
          {cultivation?.name || "N/A"}
        </div>
        <div>
    {cultivation?.description}
        </div>
      </div>
      <ModalFooter>
        <div className={`btn submitButton`}>Submit</div>
        <div className="btn cancelButton">Cancel</div>
      </ModalFooter>
    </Modal>
  );
};
