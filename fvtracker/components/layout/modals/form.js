import Modal, { ModalFooter } from "./modal";
import styles from "@/components/form/form.module.css";

export function FormModal({
  isOpen,
  onCancel,
  onSubmit,
  title,
  children,
  invertColor,
  submitDisabled,
}) {
  return (
    <Modal
      invertColor={invertColor}
      isOpen={isOpen}
      onCancel={onCancel}
      title={title}
    >
      {" "}
      {children}
      <FormModalFooter
        onCancel={onCancel}
        onSubmit={onSubmit}
        submitDisabled={submitDisabled}
      />
    </Modal>
  );
}

function FormModalFooter({ onCancel, onSubmit, submitDisabled }) {
  return (
    <ModalFooter>
      <div onClick={onCancel} className="btn cancelButton">
        Odustani
      </div>
      <button
        onClick={submitDisabled ? null : onSubmit}
        className={`btn submitButton ${submitDisabled ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={submitDisabled}
      >
        Spremi
      </button>
    </ModalFooter>
  );
}

export function UpdateModal({
  onDelete,
  title,
  isOpen,
  onCancel,
  onSubmit,
  children,
}) {
  return (
    <FormModal
      isOpen={isOpen}
      onCancel={onCancel}
      title={title}
      onSubmit={onSubmit}
    >
      <div className="flex items-center justify-end w-full pr-4 ">
        <div onClick={onDelete} className={`btn cancelButton btnSm `}>
          Obriši
        </div>
      </div>
      {children}
    </FormModal>
  );
}
