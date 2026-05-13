import { UnathorizedPage } from "@/components/auth/unAuthorized";
import { OrdersList } from "@/components/financialManager/orders";
import { fetchManager } from "@/lib/auth/fetchSessionData";
import { FINANCIAL_MANAGER } from "@/lib/constants/users/managerTypes";
import React from "react";

async function OrdersPage() {
  const {
    specificManager: financialManager,
    unauthorized,
    generalManager,
  } = await fetchManager({
    managerNames: [FINANCIAL_MANAGER],
  });
  if (unauthorized) return <UnathorizedPage />;
  if (generalManager) return <div>OrdersPage General Manager</div>;
  if (financialManager)
    return (
      <div>
        <OrdersList />
      </div>
    );
  return <div>OrdersPage No Manager</div>;
}

export default OrdersPage;
