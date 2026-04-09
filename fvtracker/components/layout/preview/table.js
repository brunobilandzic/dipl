import { PiEmpty } from "react-icons/pi";

export const AppTable = ({ headerItems, rows }) => {
  const numCols = headerItems ? headerItems.length : 0;
  return (
    <>
      {rows?.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headerItems?.map((item, index) => (
                <th key={index} className="">
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <NoTableRows numCols={numCols} />
      )}
    </>
  );
};

const NoTableRows = ({ numCols }) => {
  return (
    <div className="flex items-center justify-center gap-2 text-gray-500 text-2xl py-4">
      <PiEmpty />
      <span>Nema podataka</span>
    </div>
  );
};
