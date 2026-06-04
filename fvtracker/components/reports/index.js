"use client";

import { CultivationManagerReports } from "./cultivation/manager";
import { ReportsDashboard } from "./dashboard";
import { ProductionReportsSector } from "./production";

export const AllReports = ({}) => {
  return (
    <ReportsDashboard>
      <CultivationManagerReports />
      <ProductionReportsSector />
    </ReportsDashboard>
  );
};
