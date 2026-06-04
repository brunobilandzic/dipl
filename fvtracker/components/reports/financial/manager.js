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
        <ReportItem count={workers.length} description={"Prijava"} />

        <ReportItem
          count={employedWorkers.length}
          description={"Zaposlen" + (employedWorkers.length > 1 ? "ih" : "")}
        />
        <ReportItem
          count={unemployedWorkers.length}
          description={
            "Nezaposlen" + (unemployedWorkers.length > 1 ? "ih" : "")
          }
        />
        <ReportItem count={pendingWorkers.length} description={"Na čekanju"} />
        <ReportItem
          count={totalHourlyRate.toFixed(2)}
          description={"Ukupna satnica (€)"}
        />
      </ReportSection>
    </ReportSector>
  );
};
