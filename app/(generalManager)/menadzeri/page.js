import React from "react";
import { ManagerList } from "@/components/generalManager/menagers";
import {
  checkGeneralManagerRequest,
  fetchAdmin,
} from "@/lib/auth/fetchSessionData";
import { GENERAL_MANAGER } from "@/lib/constants/users/managerTypes";
import { fetchSessionSpecificManager } from "@/lib/auth/fetchSessionData";
import { UnathorizedPage } from "@/components/auth/unAuthorized";

const ManagerListPage = async () => {
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
      <div>
        <ManagerList />
      </div>
    </div>
  );
};

export default ManagerListPage;
