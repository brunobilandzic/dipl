import { UnathorizedPage } from "@/components/auth/unAuthorized";
import { AllReports } from "@/components/reports";
import { ReportsDashboard } from "@/components/reports/dashboard";
import { fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import { MANAGER_TYPES } from "@/lib/constants/users/managerTypes";
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
  if (generalManager) return <AllReports />;
}

export default ReportsPage;
