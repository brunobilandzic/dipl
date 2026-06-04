"use client";

import { CultivationReport } from "./cultivation/manager";
import { ReportsDashboard } from "./dashboard";
import { FinancialReport } from "./financial/manager";
import { ProductionReport } from "./production/manager.";
import { WarehouseReport } from "./warehouse/manager";

export const AllReports = ({}) => {
  return (
    <ReportsDashboard>
      <CultivationReport />
      <ProductionReport />
      <WarehouseReport />
      <FinancialReport />
    </ReportsDashboard>
  );
};
