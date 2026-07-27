export const AppTile = ({ onClick, children }) => {
  return (
    <>
      <div
        onClick={onClick}
        className="bg-white border border-gray-200 rounded-lg col-span-1 row-span-1 h-[200px] md:h-[300px] p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
      >
        {children}
      </div>
    </>
  );
};

export const AppTilesGrid = ({ children, key }) => {
  return (
    <div
      key={key}
      className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 w-full"
    >
      {children}
    </div>
  );
};
