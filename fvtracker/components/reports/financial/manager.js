import { useSelector } from "react-redux";
import { ReportItem, ReportSection, ReportSector } from "../dashboard";
import { getUniqueCustomers } from "@/lib/utils/webstore/orders";
import { stringQuant } from "@/lib/utils/strings";

export const FinancialReport = ({}) => {
  const orders = useSelector((state) => state.webstore.orders.items);
  if (!orders) return null;
  console.log({ orders });

  const uniqueCustomers = getUniqueCustomers(orders);

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
      </ReportSection>
    </ReportSector>
  );
};
