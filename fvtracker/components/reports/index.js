"use client";

import { CultivationManagerReports } from "./cultivation/manager";
import { ReportsDashboard } from "./dashboard";
import { ProductionManagerReports } from "./production/manager.";
import { WarehouseReport } from "./warehouse/manager";

export const AllReports = ({}) => {
  return (
    <ReportsDashboard>
      <CultivationManagerReports />
      <ProductionManagerReports />
      <WarehouseReport />
    </ReportsDashboard>
  );
};
