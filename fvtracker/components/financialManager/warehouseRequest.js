import { useState } from "react";
import { FormModal } from "../layout/modals/form";
import { AppInput, AppSelect } from "../form/inputs";
import { useSelector } from "react-redux";

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
  const warehouseManagers = useSelector(
    (state) => state.managers.warehouseManagers,
  );

  const onChange = (e) => {
    setWarehouseRequest((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <FormModal isOpen={isOpen} onCancel={onCancel}>
      <AppSelect
        name="warehouseManagerId"
        label="Skladištar"
        onChange={onChange}
      />
    </FormModal>
  );
};
