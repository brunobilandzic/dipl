export const ProductActionComponent = ({ onClick, children }) => {
  return (
    <>
      <div
        className="text-xl hover:text-2xl hover:font-bold "
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClick();
        }}
      >
        {children}
      </div>
    </>
  );
};
