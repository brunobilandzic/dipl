"use client";

export const ReportsDashboard = ({ children }) => {
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Reports Dashboard</h1>
      <div className="grid grid-cols-4">{children}</div>
    </div>
  );
};

export const ReportItem = ({ children, count, description, title, stats }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
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
