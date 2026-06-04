import { useSelector } from "react-redux";
import { ReportSector } from "../dashboard";

export const FinancialReport = ({}) => {
  const orders = useSelector((state) => state.webstore.orders);
  if (!orders) return null;
  console.log({ orders });

  return <ReportSector title="Financije"></ReportSector>;
};
