"use client";

import { CultivationManagerReports } from "./cultivation/manager";
import { ReportsDashboard } from "./dashboard";

export const AllReports = ({}) => {
  return (
    <ReportsDashboard>
      <CultivationManagerReports />
    </ReportsDashboard>
  );
};
