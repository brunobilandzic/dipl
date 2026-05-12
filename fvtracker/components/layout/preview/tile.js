export const AppTile = ({ onClick, children }) => {
  return (
    <>
      <div
        onClick={onClick}
        className="border rounded-lg col-span-1 row-span-1 p-4 cursor-pointer hover:outline hover:outline-2 hover:outline-blue-500"
      >
        {children}
      </div>
    </>
  );
};

export const AppTilesGrid = ({ children }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4">
      {children}
    </div>
  );
};
