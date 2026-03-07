import Modal from "./modal"

  console.log("isopnen:", isOpen);
  console.log("cultivation:", cultivation);
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
