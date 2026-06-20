import { useSelector } from "react-redux";

export const FinancialWorkerInfo = ({ receipts, warehouseRequests }) => {
  const orders = useSelector((state) => state.webstore.orders?.items);
  return (
    <>
      <div className="info-group">
        <div>Izdano računa: {receipts?.length || 0}</div>
        <div>Naručeno otpremnica: {warehouseRequests?.length || 0}</div>       
      </div>
    </>
  );
};
