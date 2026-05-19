"use client";

import { useDispatch, useSelector } from "react-redux";
import { warehouseRequestItems } from "@/lib/utils/documents/requests";
import { ListItem } from "../../layout/preview/list";
import { WAREHOUSE_MANAGER } from "@/lib/constants/users/managerTypes";
import { CreateShipmentModal } from "../shipment/create";
import { useState } from "react";
import {
  SHIPMENT_SHIPPED,
  SHIPMENT_SHIPPABLE,
  SHIPMENT_PENDING,
} from "@/lib/constants/warehouse/shipment";

export const WarehouseRequestList = () => {
  const warehouseRequests = useSelector(
    (state) => state.warehouse.warehouseRequests,
  );
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
  let isShipable = request.shipment?.status === SHIPMENT_SHIPPABLE;
  let isSipped = request.shipment?.status === SHIPMENT_SHIPPED;
  let isPending =
    !request.shipment || request.shipment?.status === SHIPMENT_PENDING;

  const managerModelName = useSelector(
    (state) => state.user.session.managerModelName,
  );
  const order = useSelector((state) =>
    state.webstore.orders.items.find((o) => o._id === request.order._id),
  );

  const [createShipmentModalOpen, setCreateShipmentModalOpen] = useState(false);

  const actions = [
    ...(managerModelName == WAREHOUSE_MANAGER
      ? [
          {
            label: "Obradi",
            onClick: () => {
              setCreateShipmentModalOpen(true);
            },
            className: "submitButton",
          },
        ]
      : []),
  ];
  return (
    <>
      <ListItem actionOptions={actions}>
        {" "}
        <div key={request._id}>
          <p>Narudžba: {request.order.number}</p>
          <div>
            <ItemList
              items={warehouseRequestItems(request)}
              orderItems={order?.items || []}
            />
          </div>
        </div>
      </ListItem>
      {createShipmentModalOpen && (
        <CreateShipmentModal
          isOpen={createShipmentModalOpen}
          onCancel={() => setCreateShipmentModalOpen(false)}
          warehouseRequestId={request._id}
          shipmentItems={warehouseRequestItems(request)}
          oldShipment={request.shipment}
          order={order}
        />
      )}
    </>
  );
};

const ItemList = ({ items, orderItems }) => {
  return (
    <ul className="list-disc list-inside">
      {items.map((item, index) => (
        <li key={index}>
          {item.product} x {item.quantity},{" "}
          {getShippedQuantity({ productName: item.product, orderItems })} od{" "}
          {item.quantity} isporučeno
        </li>
      ))}
    </ul>
  );
};

const getShippedQuantity = ({ productName, orderItems }) => {
  const a = orderItems
    .filter((oi) => oi.product.name === productName)
    .reduce((acc, oi) => {
      acc += oi.shipmentItems.reduce((sAcc, si) => {
        sAcc += Number(si.quantity);
        return sAcc;
      }, 0);
      return acc;
    }, 0);

  return a;
};
