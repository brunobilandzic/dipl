import Modal from "./modal";

export function MenuModal({
  onCancel,
  options = [],
  title = "Menu",
  isOpen = false,
  invertColor,
}) {
  if (!isOpen) return null;
  return (
    <Modal
      isOpen={isOpen}
      onCancel={onCancel}
      title={title}
      invertColor={invertColor}
    >
      <div className="flex flex-col gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={option.onClick}
            className={option.className ? option.className : "btn w-full"}
          >
            {option.label}
          </div>
        ))}
      </div>
    </Modal>
  );
}
