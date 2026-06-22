"use client";

export const ReportsDashboard = ({ children, managerModelName }) => {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-extrabold">Izvještaji</h1>
      <div className="flex flex-col gap-8">{children}</div>
    </div>
  );
};

export const ReportSector = ({ workers, title, children }) => {
  return (
    <div className="w-full mb-8 mt-4 ">
      <h2 className="text-2xl font-bold mb-4">
        {workers ? "Radnici" : "Sektor"}: {title}
      </h2>
      {children}
    </div>
  );
};

export const ReportSection = ({ title, children }) => {
  return (
    <div className="mb-8 w-full ">
      <h2 className="text-xl mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">{children}</div>
    </div>
  );
};

export const ReportItem = ({ children, count, description, title, stats }) => {
  const renderedDescription =
    typeof description === "string" ? description.toLowerCase() : description;

  return (
    <div className="bg-gray-100 rounded-lg shadow p-4 min-h-22  hover:bg-gray-200">
      <div className="text-xl font-extrabold">{title}</div>
      <div className="text-xl font-extrabold">{count}</div>
      <div className="text-gray-600">{renderedDescription}</div>
      {stats?.map((stat, index) => (
        <div key={index} className="text-sm text-gray-400">
          {stat}
        </div>
      ))}
      <div className="text-gray-600">{children}</div>
    </div>
  );
};
