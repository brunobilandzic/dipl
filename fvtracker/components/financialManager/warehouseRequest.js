import { useState } from "react";
import { FormModal } from "../layout/modals/form";

export const WarehouseRequestModal = ({ isOpen, onCancel, order }) => {
  const initialWarehouseRequest = {
    items: order.items,
    orderNumber: order.number,
    warehouseManagerId: null,
    financialManagerId: null,
  };
  const [warehouseRequest, setWarehouseRequest] = useState(
    initialWarehouseRequest,
  );
  return <FormModal isOpen={isOpen} onCancel={onCancel}></FormModal>;
};
