"use client";

import { useDispatch, useSelector } from "react-redux";
import { warehouseRequestItems } from "@/lib/utils/documents/requests";
import { ListItem } from "../../layout/preview/list";
import { WAREHOUSE_MANAGER } from "@/lib/constants/users/managerTypes";
import { CreateShipmentModal } from "../shipment/create";
import { useState } from "react";
import {
  SHIPMENT_SHIPPED_FULLY,
  SHIPMENT_SHIPPED_PARTLY,
  SHIPMENT_PENDING,
} from "@/lib/constants/warehouse/shipment";
import { useRouter } from "next/navigation";

export const WarehouseRequestList = () => {
  const warehouseRequests = useSelector(
    (state) => state.warehouse.warehouseRequests,
  );
  const router = useRouter();
  return (
    <>
      <div className="text-2xl font-bold mb-4">Zahtjevi skladištu</div>
      <div className="flex flex-col gap-4 mb-6">
        {warehouseRequests?.map((wr) => (
          <WarehouseRequestListItem key={wr._id} request={wr} router={router} />
        ))}
      </div>
    </>
  );
};

const WarehouseRequestListItem = ({ request, router }) => {
  let isPartlyShipped = request.shipment?.status === SHIPMENT_SHIPPED_PARTLY;
  let isFullyShipped = request.shipment?.status === SHIPMENT_SHIPPED_FULLY;
  let isPending =
    !request.shipment || request.shipment?.status === SHIPMENT_PENDING;

  let outlineClassName;

  if (isPartlyShipped) {
    outlineClassName = "border-yellow-700";
  } else if (isFullyShipped) {
    outlineClassName = "border-green-700";
  } else if (isPending) {
    outlineClassName = "border-gray-700";
  }

  const managerModelName = useSelector(
    (state) => state.user.session.managerModelName,
  );
  const workerType = useSelector((state) => state.user.session.workerType);
  const order = useSelector((state) =>
    state.webstore.orders.items.find((o) => o._id === request.order._id),
  );

  const [createShipmentModalOpen, setCreateShipmentModalOpen] = useState(false);

  const actions = [
    ...((managerModelName == WAREHOUSE_MANAGER ||
      workerType == "WarehouseWorker") &&
    !isFullyShipped
      ? [
          {
            label: "Obradi",
            onClick: (e) => {
              e.stopPropagation();
              setCreateShipmentModalOpen(true);
            },
            className: "submitButton",
          },
        ]
      : []),
  ];
  return (
    <>
      <ListItem
        href={`/otpremnice/${request.shipment._id}`}
        router={router}
        actionOptions={actions}
        _className={` border ${outlineClassName} border-2`}
        title={`Zahtjev za narudžbom ${request.order.number}`}
      >
        {" "}
        <div key={request._id}>
          <div>
            <ItemList
              items={warehouseRequestItems(request)}
              orderItems={order?.items || []}
            />
          </div>
        </div>
        <div>
          Poslano {request.shipment.shipmentItems?.length || 0} otpremnica
        </div>
        <div>
          Izrađeno {request.shipment?.shipmentItems?.filter(si => si.receipt).length || 0} računa
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
          router={router}
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
      acc += oi.shipmentSources.reduce((sAcc, ss) => {
        sAcc += Number(ss.quantity);
        return sAcc;
      }, 0);
      return acc;
    }, 0);

  return a;
};
