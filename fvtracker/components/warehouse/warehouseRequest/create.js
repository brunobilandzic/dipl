import { fillOrdersRedux } from "@/lib/utils/webstore/orders";
import { useDispatch, useSelector } from "react-redux";
import { sendWarehouseRequest } from "@/lib/utils/documents/requests";
import { useEffect, useState } from "react";
import { FormModal } from "../../layout/modals/form";
import { AppInput, AppSelect } from "../../form/inputs";
import { ChooseWorker } from "@/components/workers/choose";
import { checkEmpty } from "@/lib/utils/objects";
import {
  FINANCIAL_MANAGER,
} from "@/lib/constants/users/managerTypes";

export const WarehouseRequestModal = ({ isOpen, onCancel, order }) => {
  const initialWarehouseRequest = {
    orderId: order._id,
    warehouseId: null,
  };
  const [warehouseRequest, setWarehouseRequest] = useState(
    initialWarehouseRequest,
  );
  const warehouses = useSelector((state) => state.warehouse.warehouses?.items);

  const workers = useSelector((state) => state.workers.items);
  const workerId = useSelector((state) => state.user.session.workerId);

  const dispatch = useDispatch();

  useEffect(() => {
    if (workerId) {
      setWarehouseRequest((prev) => ({
        ...prev,
        workerId: workerId,
      }));
    }
  }, [workerId]);

  const onChange = (e) => {
    setWarehouseRequest((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    await sendWarehouseRequest({
      requestData: warehouseRequest,
      dispatch,
    });
    onCancel();
    fillOrdersRedux({ dispatch, router });
  };

  const chooseWorker = (e) => {
    const { name, value } = e.target;
    setWarehouseRequest((prev) => ({
      ...prev,
      workerId: value,
    }));
  };

  return (
    <FormModal
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitDisabled={checkEmpty(warehouseRequest, true)}
    >
      {!workerId && (
        <ChooseWorker
          workers={workers}
          onChoose={chooseWorker}
          managerModelName={FINANCIAL_MANAGER}
        />
      )}
      <AppSelect
        name="warehouseId"
        label="Skladište"
        onChange={onChange}
        options={warehouses?.map((w) => ({
          value: w._id,
          label: w.name,
        }))}
      />
    </FormModal>
  );
};
