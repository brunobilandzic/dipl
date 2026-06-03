import { UnathorizedPage } from "@/components/auth/unAuthorized";
import { EmploymentRequestsPageComponent } from "@/components/workers/employmentRequests";
import { fetchManager } from "@/lib/auth/fetchSessionData";
import { FINANCIAL_MANAGER } from "@/lib/constants/users/managerTypes";
import React from "react";

async function EmploymentRequests() {
  const { unauthorized } = await fetchManager({
    managerNames: [FINANCIAL_MANAGER],
  });
  if (unauthorized) return <UnathorizedPage />;
  return (
    <div>
      <EmploymentRequestsPageComponent />
    </div>
  );
}

export default EmploymentRequests;
