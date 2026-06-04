import { UnathorizedPage } from "@/components/auth/unAuthorized";
import { AllReports } from "@/components/reports";
import { ReportsDashboard } from "@/components/reports/dashboard";
import { fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import {
  FINANCIAL_MANAGER,
  MANAGER_TYPES,
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
    console.log(
      "Rendering AllReports for financial manager or general manager",
    );
    return <AllReports />;
  }
}

export default ReportsPage;
