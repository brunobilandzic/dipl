import { UnathorizedPage } from "@/components/auth/unAuthorized";
import { AllReports } from "@/components/reports";
import { CultivationReport } from "@/components/reports/cultivation/manager";
import { ProductionReport } from "@/components/reports/production/manager.";
import { WarehouseReport } from "@/components/reports/warehouse/manager";
import { WorkersReport } from "@/components/reports/worker";
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
  const { specificManager,  generalManager, unauthorized } =
    await fetchManagerWorker({ managerNames: MANAGER_TYPES });
  if (unauthorized) return <UnathorizedPage />;
  if (
    generalManager ||
    specificManager?.rootManager?.managerModelName === FINANCIAL_MANAGER
  ) {
    return <AllReports />;
  }
  switch (specificManager?.rootManager?.managerModelName) {
    case CULTIVATION_MANAGER:
      return (
        <ReportWithWorkers managerModelName={CULTIVATION_MANAGER}>
          <CultivationReport />
        </ReportWithWorkers>
      );
    case PRODUCTION_MANAGER:
      return (
        <ReportWithWorkers managerModelName={PRODUCTION_MANAGER}>
          <ProductionReport />
        </ReportWithWorkers>
      );
    case WAREHOUSE_MANAGER:
      return (
        <ReportWithWorkers managerModelName={WAREHOUSE_MANAGER}>
          <WarehouseReport />
        </ReportWithWorkers>
      );
    default:
      throw new Error(
        `Nepoznati menadžer: ${specificManager?.rootManager?.managerModelName}`,
      );
  }
}

const ReportWithWorkers = ({ children, managerModelName }) => {
  return (
    <>
      {children}
      <WorkersReport showTitle={false} managerModelName={managerModelName} />
    </>
  );
};

export default ReportsPage;
