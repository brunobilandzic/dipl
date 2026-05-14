import { useEffect, useState } from "react";
import { FormModal } from "../layout/modals/form";
import { AppInput, AppSelect } from "../form/inputs";
import { useDispatch, useSelector } from "react-redux";
import { sendWarehouseRequest } from "@/lib/utils/documents/requests";
import { useRouter } from "next/navigation";

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
  const dispatch = useDispatch();
  const router = useRouter();

  const onChange = (e) => {
    setWarehouseRequest((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    sendWarehouseRequest({
      requestData: warehouseRequest,
      dispatch,
      router,
    });
  };

  useEffect(() => {
    console.log(warehouseRequest);
  }, [warehouseRequest]);
  return (
    <FormModal isOpen={isOpen} onCancel={onCancel} onSubmit={handleSubmit}>
      <AppSelect
        name="warehouseManagerId"
        label="Skladištar"
        onChange={onChange}
        options={warehouseManagers?.map((wm) => ({
          value: wm._id,
          label:
            wm.rootManager.appUser.name + " " + wm.rootManager.appUser.surname,
        }))}
      />
    </FormModal>
  );
};
