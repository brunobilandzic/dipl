import Modal from "./backdrop";

export function FormModal({ isOpen, onCancel, onSubmit, title, children }) {
  return (
    <Modal isOpen={isOpen} onCancel={onCancel}>
      {" "}
      <div>hey mia</div>
    </Modal>
  );
}
