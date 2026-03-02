import Modal from "./modal";

export function MenuModal({
  onCancel,
  options = [],
  title = "Menu",
  isOpen = false,
}) {
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onCancel={onCancel} title={title}>
      <div className="flex flex-col gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={option.onClick}
            className={option.className ? option.className : "btn"}
          >
            {option.label}
          </div>
        ))}
      </div>
    </Modal>
  );
}
