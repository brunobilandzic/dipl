import Modal from "./modal"

export const SeedingModal = (isOpen, onCancel, cultivationArea, plants) => {
    return <Modal title="Seeding Modal" isOpen={isOpen} onCancel={onCancel}>
        <p>Cultivation Area: {cultivationArea}</p>
        </div>
      <ModalFooter>
        <div className={`btn submitButton`}>Submit</div>
        <div className="btn cancelButton">Cancel</div>
      </ModalFooter>
    </Modal>
  );
};
