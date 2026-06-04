"use client";

export const ReportsDashboard = ({ children }) => {
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Reports Dashboard</h1>
      <div className="grid grid-cols-4">{children}</div>
    </div>
  );
};

export const ReportItem = ({ children }) => {
  return <div className="bg-white rounded-lg shadow p-4">{children}</div>;
};
