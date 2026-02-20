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
      <div onClick={onCancel} className="btn cancelButton">
        Cancel
      </div>
      <div onClick={onSubmit} className={`btn submitButton`}>
        Submit
      </div>
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
          Delete
        </div>
      </div>
      {children}
    </FormModal>
  );
}
