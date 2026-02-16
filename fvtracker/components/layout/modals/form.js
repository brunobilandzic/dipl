import Modal from "./modal";

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
        <div className="flex justify-end gap-4 mt-4">
            <div onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded cursor-pointer">
                Cancel
            </div>
            <div onClick={onSubmit} className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
                Submit
            </div>
        </div>
    );
}