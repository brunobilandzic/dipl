"use client";

export const ReportsDashboard = ({ children, managerModelName }) => {
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Izvještaji</h1>
      <div className="flex gap-8">{children}</div>
    </div>
  );
};

export const ReportSector = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <ReportSection title={title}>{children}</ReportSection>
    </div>
  );
};

export const ReportSection = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
};

export const ReportItem = ({ children, count, description, title, stats }) => {
  console.log("report item");
  return (
    <div className="bg-yellow-100 rounded-lg shadow p-4">
      <div className="text-xl font-bold">{title}</div>
      <div className="text-xl font-bold">{count}</div>
      <div className="text-gray-500">{description}</div>
      {stats?.map((stat, index) => (
        <div key={index} className="text-sm text-gray-400">
          {stat}
        </div>
      ))}
      {children}
    </div>
  );
};
