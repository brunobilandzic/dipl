"use client";

import { useEffect, useState } from "react";
import { FormModal } from "../layout/modals/form";
import { AppInput, AppSelect } from "../form/inputs";
import { useDispatch, useSelector } from "react-redux";
import {
  sendWarehouseRequest,
  warehouseRequestItems,
} from "@/lib/utils/documents/requests";
import { useRouter } from "next/navigation";
import { refreshOrdersThunk } from "@/store/webstore";
import { ListItem } from "../layout/preview/list";

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
      <div className="text-2xl font-bold mb-4">Zahtjevi skladištu</div>
      <div className="flex flex-col gap-4 mb-6">
        {warehouseRequests?.map((wr) => (
          <WarehouseRequestListItem key={wr._id} request={wr} />
        ))}
      </div>
    </>
  );
};

const WarehouseRequestListItem = ({ request }) => {
  console.log({ request });
  return (
    <ListItem>
      {" "}
      <div key={request._id}>
        <p>Narudžba: {request.order.number}</p>
        <div>
          <ItemList items={warehouseRequestItems(request)} />
        </div>
      </div>
    </ListItem>
  );
};

const ItemList = ({ items }) => {
  console.log({ items });
  return (
    <ul className="list-disc list-inside">
      {items.map((item, index) => (
        <li key={index}>
          {item.product} x {item.quantity}
        </li>
      ))}
    </ul>
  );
};
