import Modal, { ModalFooter } from "./modal";
import styles from "@/components/form/form.module.css";

export function FormModal({ isOpen, onCancel, onSubmit, title, children }) {
  return (
    <Modal isOpen={isOpen} onCancel={onCancel} title={title}>
      {" "}
      {children}
      <FormModalFooter onCancel={onCancel} onSubmit={onSubmit} />
    </Modal>
  );
}

function FormModalFooter({ onCancel, onSubmit }) {
  return (
    <ModalFooter>
      <div
        onClick={onCancel}
        className="btn cancelButton"
      >
        Cancel
      </div>
      <div
        onClick={onSubmit}
        className={`btn submitButton`}
      >
        Submit
      </div>
    </ModalFooter>
  );
}
