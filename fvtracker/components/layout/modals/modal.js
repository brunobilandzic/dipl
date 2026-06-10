import { MdClose } from "@react-icons/all-files/md/MdClose";

export default function Modal({
  isOpen,
  onCancel,
  children,
  title,
  invertColor,
}) {
  const bgTextClassName = invertColor
    ? " text-[var(--foreground)] bg-[var(--background)]"
    : " bg-[var(--foreground)] text-[var(--background)] ";

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9999] grid place-items-center p-4 bg-black/40"
            onClick={(e) => {
              if (e.target === e.currentTarget) onCancel();
            }}
          >
            <div
              className={`w-full max-w-xl max-h-[80vh] ${invertColor ? "max-w-lg" : ""} rounded-lg ${bgTextClassName} flex flex-col overflow-hidden`}
            >
              <ModalHeader title={title} onCancel={onCancel} />

              <div className="flex-1 overflow-y-auto p-4">{children}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ModalHeader({ title, onCancel }) {
  return (
    <div className="flex justify-between items-center  p-4 border-gray-300">
      <div className="text-xl font-bold">{title}</div>
      <div onClick={onCancel} className="text-xl cursor-pointer">
        <MdClose />
      </div>
    </div>
  );
}

export function ModalFooter({ children }) {
  return (
    <div className="flex justify-end gap-4   border-gray-300 pt-4">
      {children}
    </div>
  );
}
