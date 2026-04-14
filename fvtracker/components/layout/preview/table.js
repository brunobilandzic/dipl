import { PiEmpty } from "react-icons/pi";

export const AppTable = ({
  headerLabels,
  rows,
  emptyRowsLabel = "Nema podataka",
}) => {
  const numCols = headerLabels ? headerLabels.length : 0;
  return (
    <>
      {rows?.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headerLabels?.map((label, index) => (
                <th key={index} className="">
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="">
                {Object.keys(row).map((key, cellIndex) => (
                  <td key={cellIndex} className="">
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <NoTableRows emptyRowsLabel={emptyRowsLabel} />
      )}
    </>
  );
};

const NoTableRows = ({ emptyRowsLabel }) => {
  return (
    <div className="flex items-center justify-center gap-2 text-gray-500 text-2xl py-4">
      <PiEmpty />
      <span>{emptyRowsLabel}</span>
    </div>
  );
};
