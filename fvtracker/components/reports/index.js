"use client";

import { CultivationManagerReports } from "./cultivation/manager";
import { ReportsDashboard } from "./dashboard";
import { FinancialReport } from "./financial/manager";
import { ProductionManagerReports } from "./production/manager.";
import { WarehouseReport } from "./warehouse/manager";

export const AllReports = ({}) => {
  return (
    <ReportsDashboard>
      <CultivationManagerReports />
      <ProductionManagerReports />
      <WarehouseReport />
      <FinancialReport />
    </ReportsDashboard>
  );
};
