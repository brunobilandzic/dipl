"use client";

import { useDispatch, useSelector } from "react-redux";
import { warehouseRequestItems } from "@/lib/utils/documents/requests";
import { ListItem } from "../../layout/preview/list";
import { WAREHOUSE_MANAGER } from "@/lib/constants/users/managerTypes";
import { CreateShipmentModal } from "../shipment/create";
import { useState } from "react";

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
  const managerModelName = useSelector(
    (state) => state.user.session.managerModelName,
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
            <ItemList items={warehouseRequestItems(request)} />
          </div>
        </div>
      </ListItem>
      {createShipmentModalOpen && (
        <CreateShipmentModal
          isOpen={createShipmentModalOpen}
          onCancel={() => setCreateShipmentModalOpen(false)}
          warehouseRequestId={request._id}
          items={warehouseRequestItems(request)}
        />
      )}
    </>
  );
};

const ItemList = ({ items }) => {
  return (
    <ul className="list-disc list-inside">
      {items.map((item, index) => (
        <li key={index}>
          {item.product} x {item.quantity},{" "}
          {getShippedQuantity({ productName: item.product, orderItems })} od{" "}
          {item.quantity} poslanih
        </li>
      ))}
    </ul>
  );
};
