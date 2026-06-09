import { UnathorizedPage } from "@/components/auth/unAuthorized";
import { RoleRequestList } from "@/components/generalManager/managerRequests";
import auth from "@/lib/auth";
import {
  checkGeneralManagerRequest,
  fetchAdmin,
  fetchSessionSpecificManager,
} from "@/lib/auth/fetchSessionData";
import { GENERAL_MANAGER } from "@/lib/constants/users/managerTypes";
import React from "react";

const RoleRequestsPage = async () => {
  const generalManager = await fetchSessionSpecificManager({
    managerName: GENERAL_MANAGER,
    throwError: false,
  });
  const { admin } = await fetchAdmin();

  if (!admin && !generalManager) {
    return <UnathorizedPage />;
  }

  if (generalManager) {
    const { unauthorized } = await checkGeneralManagerRequest(generalManager);

    if (unauthorized) {
      return <UnathorizedPage message="Uloga nije odobrena." />;
    }
  }

  return (
    <div>
      <RoleRequestList />
    </div>
  );
};

export default RoleRequestsPage;
