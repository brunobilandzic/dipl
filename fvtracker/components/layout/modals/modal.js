import { MdOutlineClose } from "react-icons/md";

export default function Modal({ isOpen, onCancel, children, title }) {
  return (
    <>
      {isOpen && (
        <>
          <Backdrop onCancel={onCancel} />
          <div className="fixed top-1/2 left-1/2 z-30 w-[90%] md:w-[50%] bg-[var(--foreground)] text-[var(--background)] rounded-lg p-4 transform -translate-x-1/2 -translate-y-1/2">
            <ModalHeader title={title} onCancel={onCancel} />
            {children}
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
    <div className="flex justify-between items-center mb-4">
      <div className="text-xl font-bold">{title}</div>
      <div onClick={onCancel} className="text-xl cursor-pointer">
        <MdOutlineClose />
      </div>
    </div>
  );
}

export function ModalFooter({ children }) {
  return <div className="flex justify-end gap-4 mt-4">{children}</div>;
}
