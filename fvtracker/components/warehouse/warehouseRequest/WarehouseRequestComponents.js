"use client";

import { useDispatch, useSelector } from "react-redux";
import { warehouseRequestItems } from "@/lib/utils/documents/requests";
import { List, ListItem } from "../../layout/preview/list";
import { WAREHOUSE_MANAGER } from "@/lib/constants/users/managerTypes";
import { CreateShipmentModal } from "../shipment/create";
import { useMemo, useState } from "react";
import {
  SHIPMENT_SHIPPED_FULLY,
  SHIPMENT_SHIPPED_PARTLY,
  SHIPMENT_PENDING,
} from "@/lib/constants/warehouse/shipment";
import { useRouter } from "next/navigation";
import { AppTable } from "@/components/layout/preview/table";
import { filterItems, initFilters } from "@/lib/utils/list";
import { showDateTime } from "@/lib/utils/display";

export const WarehouseRequestList = () => {
  const warehouseRequests = useSelector(
    (state) => state.warehouse.warehouseRequests,
  );
  const [filters, setFilters] = useState(initFilters("warehouseRequests"));

  const displayedWarehouseRequests = useMemo(() => {
    const filtered = filterItems({
      _items: warehouseRequests || [],
      filters,
    });
    return filtered;
  }, [warehouseRequests, filters]);

  const router = useRouter();
  return (
    <>
      <List
        title="Zahtjevi za isporuku"
        filters={filters}
        setFilters={setFilters}
        initialFilters={initFilters("warehouseRequests")}
      >
        {displayedWarehouseRequests?.map((wr) => (
          <WarehouseRequestListItem key={wr._id} request={wr} router={router} />
        ))}
      </List>
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
              request={request}
            />
          </div>
        </div>
        <AppTable
          headerLabels={[
            "Broj otpremnica",
            "Broj proizvoda na otpremnicama",
            "Broj računa",
          ]}
          rows={[
            {
              shipmentItemsCount: request.shipment?.shipmentItems?.length || 0,
              shipmentProductsCount: request.shipment?.shipmentItems?.reduce(
                (acc, si) => {
                  acc +=
                    si.sources?.reduce((sAcc, ss) => {
                      sAcc += Number(ss.quantity);
                      return sAcc;
                    }, 0) ?? 0;
                  return acc;
                },
                0,
              ),
              receiptCount:
                request.shipment?.shipmentItems?.filter((si) => si.receipt)
                  .length || 0,
            },
          ]}
        />
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

const ItemList = ({ items, orderItems, request }) => {
  const { createdAt, updatedAt } = request;
  return (
    <>
      <div className="text-gray-500 text-sm"> 
        <div>Datum kreiranja: {showDateTime(createdAt)}</div>
        <div>Datum zadnje izmjene: {showDateTime(updatedAt)}</div>
      </div>
      <AppTable
        headerLabels={["proizvod", "količina", "naručeno", "isporučeno"]}
        rows={items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          ordered: orderItems.find((oi) => oi.product.name === item.product)
            ?.quantity,
          shipped: getShippedQuantity({
            productName: item.product,
            orderItems,
          }),
        }))}
        emptyRowsLabel="Nema proizvoda"
      />
    </>
  );
};

const getShippedQuantity = ({ productName, orderItems }) => {
  const a = orderItems
    .filter((oi) => oi.product?.name === productName)
    .reduce((acc, oi) => {
      acc +=
        oi.shipmentSources?.reduce((sAcc, ss) => {
          sAcc += Number(ss.quantity);
          return sAcc;
        }, 0) ?? 0;
      return acc;
    }, 0);

  return a;
};
