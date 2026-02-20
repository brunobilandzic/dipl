import { MdOutlineClose } from "react-icons/md";

export default function Modal({ isOpen, onCancel, children, title }) {
  return (
    <>
      {isOpen && (
        <>
          <Backdrop onCancel={onCancel} />
          <div className="fixed inset-0 z-30 grid place-items-center p-4">
            <div className="absolute rounded-lg p-4   bg-[var(--foreground)] text-[var(--background)]  z-30  w-screen flex flex-col max-w-xl left-1/2 -translate-x-1/2">
              <ModalHeader title={title} onCancel={onCancel} />
              {children}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function Backdrop({ onCancel }) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      className="fixed top-0 left-0 z-20 w-full h-screen bg-black opacity-40 "
    ></div>
  );
}

function ModalHeader({ title, onCancel }) {
  return (
    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-300">
      <div className="text-xl font-bold">{title}</div>
      <div onClick={onCancel} className="text-xl cursor-pointer">
        <MdOutlineClose />
      </div>
    </div>
  );
}

export function ModalFooter({ children }) {
  return (
    <div className="flex justify-end gap-4 mt-4 border-t border-gray-300 pt-4">
      {children}
    </div>
  );
}
