import { fillOrdersRedux } from "@/lib/utils/webstore/orders";
import { useDispatch, useSelector } from "react-redux";
import { sendWarehouseRequest } from "@/lib/utils/documents/requests";
import { useEffect, useState } from "react";
import { FormModal } from "../../layout/modals/form";
import { ChooseWorker } from "@/components/workers/choose";
import { checkEmpty } from "@/lib/utils/objects";
import { FINANCIAL_MANAGER } from "@/lib/constants/users/managerTypes";
import { useRouter } from "next/navigation";

export const WarehouseRequestModal = ({ isOpen, onCancel, order, warehouses }) => {
  const initialWarehouseRequest = {
    orderId: order._id,
  };
  const router = useRouter();
  const [warehouseRequest, setWarehouseRequest] = useState(
    initialWarehouseRequest,
  );

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
    </FormModal>
  );
};
