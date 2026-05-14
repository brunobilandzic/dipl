import { useEffect, useState } from "react";
import { FormModal } from "../layout/modals/form";
import { AppInput, AppSelect } from "../form/inputs";
import { useDispatch, useSelector } from "react-redux";
import { sendWarehouseRequest } from "@/lib/utils/documents/requests";
import { useRouter } from "next/navigation";
import { refreshOrdersThunk } from "@/store/webstore";

export const WarehouseRequestModal = ({ isOpen, onCancel, order }) => {
  const initialWarehouseRequest = {
    orderId: order._id,
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
    onCancel();
    dispatch(refreshOrdersThunk());
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

export const WarehouseRequestList = () => {
  const warehouseRequests = useSelector(
    (state) => state.warehouse.warehouseRequests,
  );
  console.log({ warehouseRequests });
  return (
    <>
      {warehouseRequests?.map((wr) => (
        <div key={wr._id}>
          <p>{wr.order}</p>
          <p>{wr.warehouseManager}</p>
        </div>
      ))}
    </>
  );
};
