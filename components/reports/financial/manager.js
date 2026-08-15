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
import { paidProcurmentsValue } from "@/lib/utils/documents/procurments";

export const FinancialReport = ({}) => {
  const orders = useSelector((state) => state.webstore.orders.items);
  const workers = useSelector((state) => state.workers.items);
  const procurments = useSelector((state) => state.procurments.items);
  console.log({ procurments });
  if (!orders || !workers) return <LoadingFullScreen />;

  const uniqueCustomers = getUniqueCustomers(orders);
  const uniqueProducts = getUniqueProducts(orders);
  const totalItems = getOrdersTotalItems(orders);
  const totalRevenue = ordersTotalAmount(orders);
  const warehouseRequests = useSelector(
    (state) => state.warehouse.warehouseRequests,
  );
  const {
    totalPrice: invoicedPrice,
    totalItems: totalReceiptItems,
    receiptCount,
  } = receiptsData({
    warehouseRequests,
  });

  const employedWorkers = workers.filter(
    (worker) => worker.employmentRequest.status == EMPLOYMENT_STATUS_EMPLOYED,
  );

  const totalHourlyRate = employedWorkers.reduce(
    (sum, worker) => sum + worker.hourlyRate,
    0,
  );

  if (orders.length === 0 && workers.length === 0)
    return (
      <ReportSector title="Financije">
        <p className="text-center text-gray-500 w-full mt-2">
          Nema podataka o financijama.
        </p>
      </ReportSector>
    );

  return (
    <ReportSector title="Financije">
      {orders.length > 0 ? (
        <ReportSection title="Narudžbe">
          <>
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
              description={`Različitih proizvoda`}
            />
            <ReportItem
              count={receiptCount}
              description={stringQuant({
                string: "Račun",
                quantity: receiptCount,
                pluralLetter: "a",
              })}
            />
            <ReportItem
              count={totalReceiptItems}
              description="Proizvoda na računima"
            />
            <ReportItem
              count={totalRevenue.toFixed(2)}
              description={"Vrijednost (€)"}
            />
            <ReportItem
              count={invoicedPrice.toFixed(2)}
              description={"Vrijednost računa (€)"}
            />
          </>
        </ReportSection>
      ) : (
        <p className="text-center text-gray-500 w-full">
          Nema podataka o narudžbama.
        </p>
      )}
      {workers.length ? (
        <GeneralWorkersReport workers={workers} title="Radnici">
          <>
            <ReportItem
              count={((totalHourlyRate * 160) / employedWorkers.length).toFixed(
                2,
              )}
              description={"Prosječni mesečni trošak svih radnika (€)"}
            />
            <ReportItem
              count={((totalHourlyRate * 160) / totalRevenue).toFixed(2)}
              description={"Trošak svih radnika u odnosu na prihod (%)"}
            />
          </>
        </GeneralWorkersReport>
      ) : (
        <p className="text-center text-gray-500 w-full mt-2">
          Nema podataka o radnicima.
        </p>
      )}
      {procurments.length > 0 ? (
        <ReportSection title="Nabavke">
          <>
            <ReportItem
              count={procurments.length}
              description={"Nabavk" + (procurments.length > 1 ? "e" : "a")}
            />
            <ReportItem
              count={procurments.flatMap((p) => p.items).length}
              description="Ukupno proizvoda u nabavkama"
            />
            <ReportItem
              count={procurments
                .reduce(
                  (sum, p) =>
                    sum + p.items.reduce((s, i) => s + i.quantity * i.price, 0),
                  0,
                )
                .toFixed(2)}
              description={"Ukupna vrijednost nabavki (€)"}
            />
            <ReportItem
              count={paidProcurmentsValue(procurments).toFixed(2)}
              description={"Ukupna vrijednost plaćenih nabavki (€)"}
            />
          </>
        </ReportSection>
      ) : (
        <p className="text-center text-gray-500 w-full mt-2">
          Nema podataka o nabavkama.
        </p>
      )}
    </ReportSector>
  );
};
