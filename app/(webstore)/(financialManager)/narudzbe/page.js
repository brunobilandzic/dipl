import { UnathorizedPage } from "@/components/auth/unAuthorized";
import { OrdersList } from "@/components/financialManager/orders";
import {  fetchManagerWorker } from "@/lib/auth/fetchSessionData";
import { FINANCIAL_MANAGER } from "@/lib/constants/users/managerTypes";
import React from "react";
import { managerMorkerMap } from "@/lib/constants/users/managerWorker";

async function OrdersPage() {
  let { specificManager, worker, unauthorized } = await fetchManagerWorker({
    managerNames: [FINANCIAL_MANAGER],
    workerType: managerMorkerMap[FINANCIAL_MANAGER],
  });
  if (unauthorized) return <UnathorizedPage />;
  if (specificManager || worker)
    return (
      <div>
        <OrdersList />
      </div>
    );
  return <div>OrdersPage No Manager</div>;
}

export default OrdersPage;
