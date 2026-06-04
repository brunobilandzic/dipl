import { useSelector } from "react-redux";
import { ReportItem, ReportSection, ReportSector } from "../dashboard";
import {
  getOrdersTotalItems,
  getUniqueCustomers,
  getUniqueProducts,
} from "@/lib/utils/webstore/orders";
import { stringQuant } from "@/lib/utils/strings";
import { ordersTotalAmount } from "@/lib/utils/sales";

export const FinancialReport = ({}) => {
  const orders = useSelector((state) => state.webstore.orders.items);
  const workers = useSelector((state) => state.workers.items);
  if (!orders || !workers) return null;
  console.log({ orders, workers });

  const uniqueCustomers = getUniqueCustomers(orders);
  const uniqueProducts = getUniqueProducts(orders);
  const totalItems = getOrdersTotalItems(orders);
  const totalRevenue = ordersTotalAmount(orders);

  const totalHourlyRate = workers.reduce(
    (sum, worker) => sum + worker.hourlyRate,
    0,
  );
  const employedWorkers = workers.filter(
    (worker) => worker.employmentRequest.status == EMPLOYMENT_STATUS_EMPLOYED,
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
        <ReportItem
          count={totalItems}
          description={stringQuant({
            string: "Komad",
            quantity: totalItems,
            pluralLetter: "a",
          })}
        />
        <ReportItem
          count={totalRevenue.toFixed(2)}
          description={"Vrijednost (€)"}
        />
      </ReportSection>
      <ReportSection title="Radnici">
        <ReportItem
          count={workers.length}
          description={"Radnik" + (workers.length > 1 ? "a" : "")}
        />
        <ReportItem
          count={employedWorkers.length}
          description={"Zaposlen" + (employedWorkers.length > 1 ? "ih" : "")}
        />
        <ReportItem
          count={totalHourlyRate.toFixed(2)}
          description={"Ukupna satnica (€)"}
        />
      </ReportSection>
    </ReportSector>
  );
};
