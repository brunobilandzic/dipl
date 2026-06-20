"use client";
import { useSelector } from "react-redux";
import { ReportItem, ReportSection, ReportSector } from "../dashboard";
import {
  getOrdersTotalItems,
  getUniqueCustomers,
  getUniqueProducts,
} from "@/lib/utils/webstore/orders";
import { stringQuant } from "@/lib/utils/strings";
import { ordersTotalAmount } from "@/lib/utils/sales";
import {
  EMPLOYMENT_STATUS_EMPLOYED,
  EMPLOYMENT_STATUS_PENDING,
  EMPLOYMENT_STATUS_UNEMPLOYED,
} from "@/lib/constants/users/workers";
import { GeneralWorkersReport } from "../worker";
import { LoadingFullScreen } from "@/components/layout/loading";
import { receiptsData } from "@/lib/utils/webstore/receipts";

export const FinancialReport = ({}) => {
  const orders = useSelector((state) => state.webstore.orders.items);
  const workers = useSelector((state) => state.workers.items);
  if (!orders || !workers) return <LoadingFullScreen />;

  const uniqueCustomers = getUniqueCustomers(orders);
  const uniqueProducts = getUniqueProducts(orders);
  const totalItems = getOrdersTotalItems(orders);
  const totalRevenue = ordersTotalAmount(orders);
  const warehouseRequests = useSelector(
    (state) => state.warehouse.warehouseRequests,
  );
  console.log({ component: { warehouseRequests } });
  const {
    totalPrice: invoicedPrice,
    totalItems: totalReceiptItems,
    receiptCount,
  } = receiptsData({
    warehouseRequests,
  });

  const totalHourlyRate = workers.reduce(
    (sum, worker) => sum + worker.hourlyRate,
    0,
  );
  const employedWorkers = workers.filter(
    (worker) => worker.employmentRequest.status == EMPLOYMENT_STATUS_EMPLOYED,
  );
  const unemployedWorkers = workers.filter(
    (worker) => worker.employmentRequest.status == EMPLOYMENT_STATUS_UNEMPLOYED,
  );
  const pendingWorkers = workers.filter(
    (worker) => worker.employmentRequest.status == EMPLOYMENT_STATUS_PENDING,
  );

  return (
    <ReportSector title="Financije">
      <ReportSection title="Narudžbe">
        <ReportItem
          count={orders.length}
          description={"Narudžb" + (orders.length > 1 ? "i" : "a")}
        />
        <ReportItem
          count={uniqueCustomers.length}
          description={stringQuant({
            string: "Kupac",
            quantity: uniqueCustomers.length,
            pluralLetter: "a",
          })}
        />
        <ReportItem
          count={uniqueProducts.length}
          description={stringQuant({
            string: "Proizvod",
            quantity: uniqueProducts.length,
            pluralLetter: "a",
          })}
        />
        <ReportItem count={totalItems} description="naručeno proizvoda" />
        <ReportItem
          count={totalReceiptItems}
          description={stringQuant({
            string: "Komad",
            quantity: totalReceiptItems,
            pluralLetter: "a",
          })}
        />
        <ReportItem
          count={totalRevenue.toFixed(2)}
          description={"Vrijednost (€)"}
        />
        <ReportItem
          count={invoicedPrice.toFixed(2)}
          description={"Računi (€)"}
        />
      </ReportSection>
      <GeneralWorkersReport workers={workers} title="Radnici">
        <ReportItem
          count={((totalHourlyRate * 160) / employedWorkers.length).toFixed(2)}
          description={"Prosječni mesečni trošak (€)"}
        />
        <ReportItem
          count={((totalHourlyRate * 160) / totalRevenue).toFixed(2)}
          description={"Trošak radnika (%)"}
        />
      </GeneralWorkersReport>
    </ReportSector>
  );
};
