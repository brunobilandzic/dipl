import { RoleRequestList } from "@/components/generalManager/managerRequests";
import auth from "@/lib/auth";
import { GENERAL_MANAGER } from "@/lib/constants/users/managerTypes";
import React from "react";

const RoleRequestsPage = async () => {
  const generalManager = await auth.session.specificManager({
    managerName: GENERAL_MANAGER,
    throwError: false,
  });
  if (!generalManager) {
    return (
      <UnathorizedPage message="Nemate pristup ovoj stranici. Prijavite se kao Generalni Manager." />
    );
  }
  return (
    <div>
      <RoleRequestList />
    </div>
  );
};

export default RoleRequestsPage;
