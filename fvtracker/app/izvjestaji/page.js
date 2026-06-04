import { UnathorizedPage } from "@/components/auth/unAuthorized";
import { AllReports } from "@/components/reports";
import { CultivationReport } from "@/components/reports/cultivation/manager";
import { ReportsDashboard } from "@/components/reports/dashboard";
import { ProductionReport } from "@/components/reports/production/manager.";
import { WarehouseReport } from "@/components/reports/warehouse/manager";
import { fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import {
  CULTIVATION_MANAGER,
  FINANCIAL_MANAGER,
  MANAGER_TYPES,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";
import React from "react";

async function ReportsPage() {
  const { specificManager, worker, generalManager, unauthorized } =
    await fetchManagerWorker({ managerNames: MANAGER_TYPES });
  console.log({
    specificManager,
    worker,
    generalManager,
    unauthorized,
  });
  if (unauthorized) return <UnathorizedPage />;
  if (
    generalManager ||
    specificManager?.rootManager?.managerModelName === FINANCIAL_MANAGER
  ) {
    return <AllReports />;
  }
  switch (specificManager?.rootManager?.managerModelName) {
    case CULTIVATION_MANAGER:
      return <CultivationReport />;
    case PRODUCTION_MANAGER:
      return <ProductionReport />;
    case WAREHOUSE_MANAGER:
      return <WarehouseReport />;
    default:
      throw new Error(
        `Nepoznati menadžer: ${specificManager?.rootManager?.managerModelName}`,
      );
  }
}

export default ReportsPage;
