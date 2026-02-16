export default function Modal({ isOpen, onCancel, children }) {
  return (
    <>
      {isOpen && (
        <>
          <Backdrop onCancel={onCancel} />
          <div className="fixed top-1/2 left-1/2 z-30 w-[90%] md:w-[50%] bg-white rounded-lg p-4 transform -translate-x-1/2 -translate-y-1/2">
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
