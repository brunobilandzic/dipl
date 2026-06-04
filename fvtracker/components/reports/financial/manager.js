import { useSelector } from "react-redux";
import { ReportItem, ReportSection, ReportSector } from "../dashboard";
import {
  getUniqueCustomers,
  getUniqueProducts,
} from "@/lib/utils/webstore/orders";
import { stringQuant } from "@/lib/utils/strings";

export const FinancialReport = ({}) => {
  const orders = useSelector((state) => state.webstore.orders.items);
  if (!orders) return null;
  console.log({ orders });

  const uniqueCustomers = getUniqueCustomers(orders);
  const uniqueProducts = getUniqueProducts(orders);
  console.log({ uniqueProducts });

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
      </ReportSection>
    </ReportSector>
  );
};
