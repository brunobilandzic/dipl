export const AppTable = ({ headerItems, rows }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {headerItems?.map((item, index) => (
            <th key={index} className="border p-2 text-left">
              {item.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows?.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-t">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="border p-2">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
