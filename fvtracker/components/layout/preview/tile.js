export const AppTile = ({ onClick, children }) => {
  return (
    <>
      <div
        onClick={onClick}
        className="border rounded-lg col-span-1 row-span-1 h-[200px] md:h-[300px] p-4 cursor-pointer hover:outline hover:outline-2 hover:outline-blue-500"
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
      className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 w-full"
    >
      {children}
    </div>
  );
};
