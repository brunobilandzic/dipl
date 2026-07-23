"use client";

import { ListItem } from "@/components/layout/preview/list";
import api from "@/lib/api";
import handleError from "@/lib/constants/errors/client/handleError";
import { FINANCIAL_MANAGER } from "@/lib/constants/users/managerTypes";
import { showDate, showDateTime } from "@/lib/utils/display";
import { sortItems } from "@/lib/utils/list";
import { notFound } from "next/navigation";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setLoading } from "@/store/loading";
import { useState } from "react";
import { FormModal } from "@/components/layout/modals/form";
import { ChooseWorker } from "@/components/workers/choose";
import { SORT_INIT_VALUE } from "@/lib/constants/others";
import { translateShipmentStatus } from "@/lib/utils/strings";
import { financialPayWorker } from "@/store/workers";

function ShipmentPageComponent({ shipment }) {
  if (!shipment) {
    return notFound();
  }

  const dispatch = useDispatch();
  const router = useRouter();

  const managerModelName = useSelector(
    (state) => state.user?.session?.managerModelName,
  );

  const { warehouseRequest, status, shipmentItems } = shipment;
  const { order } = warehouseRequest || {};
  const sources = shipmentItems.reduce(
    (acc, si) => [...acc, ...si.sources],
    [],
  );

  return (
    <div>
      <div>
        <div className="text-3xl font-bold mb-2">
          Narudžba {order?.number} - Otpremnica
        </div>
        <div>{translateShipmentStatus(shipment?.status)}</div>
        {shipmentItems.length > 0 ? (
          <div className="mt-4 pl-12">
            <ShipmentItemList
              managerModelName={managerModelName}
              shipmentItems={shipmentItems}
              dispatch={dispatch}
              router={router}
            />
          </div>
        ) : (
          <div className="mt-4 pl-12">
            Nema dostupnih stavki za ovu pošiljku.
          </div>
        )}
      </div>
    </div>
  );
}

export default ShipmentPageComponent;

const ShipmentItemList = ({
  managerModelName,
  shipmentItems,
  dispatch,
  router,
}) => {
  const workers = useSelector((state) => state.workers.items);
  const workerId = useSelector((state) => state.user?.session?.workerId);
  const workerType = useSelector((state) => state.user?.session?.workerType);
  const sortedShipmentItems = sortItems({
    items: shipmentItems,
    sortBy: SORT_INIT_VALUE,
  });
  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg">Pošiljke:</div>
      <div className="flex flex-col gap-8">
        {sortedShipmentItems?.map((si) => (
          <ShipmentItem
            key={si._id}
            shipmentItem={si}
            managerModelName={managerModelName}
            dispatch={dispatch}
            router={router}
            workers={workers}
            workerId={workerId}
            workerType={workerType}
          />
        ))}
      </div>
    </div>
  );
};

const ShipmentItem = ({
  shipmentItem,
  managerModelName,
  dispatch,
  router,
  workers,
  workerId,
  workerType,
}) => {
  const { sources, receipt, createdAt, _id } = shipmentItem;
  const [makeReceiptOpen, setMakeReceiptOpen] = useState(false);
  const [worker, setWorker] = useState(workerId);
  const handleReceiptCreation = async () => {
    try {
      dispatch(setLoading(true));
      const res = await api.post("/receipt", {
        shipmentItemId: _id,
        workerId: worker,
      });
      shipmentItem.receipt = res.data.newReceipt; // Assuming the response contains the new receipt ID
      console.log("Receipt created successfully:", res.data.newReceipt);
      dispatch(
        financialPayWorker({ workerId: worker, receipt: res.data.newReceipt }),
      );
      dispatch(setLoading(false));
      // Handle success (e.g., show a message, refresh data)
    } catch (error) {
      console.error("Error creating receipt:", error);
      dispatch(setLoading(false));
      // Handle error (e.g., show an error message)
      handleError(
        { ...error, generalMessage: "Greška prilikom kreiranja računa" },
        router,
      );
    }
  };

  const actionOptions = [
    ...((managerModelName === FINANCIAL_MANAGER ||
      workerType === "FinancialWorker") &&
    !receipt
      ? [
          {
            label: "Izradi račun",
            onClick: (e) => {
              e.stopPropagation();
              if (!workerId) {
                setMakeReceiptOpen(true);
              } else {
                handleReceiptCreation();
              }
            },
            className: "submitButton",
          },
        ]
      : []),
  ];

  return (
    <>
      <ListItem
        key={_id}
        actionOptions={actionOptions}
        title={`${showDateTime(createdAt)}`}
      >
        <div>
          <SourceList sources={sources} />
          {receipt && (
            <div className="pt-8 text-right">
              <strong>Račun kreiran</strong> {receipt.number} (kreiran{" "}
              {showDateTime(receipt.createdAt)})
            </div>
          )}
        </div>
      </ListItem>
      {makeReceiptOpen && (
        <FormModal
          isOpen={makeReceiptOpen}
          onCancel={() => setMakeReceiptOpen(false)}
          title="Izrada računa"
          submitDisabled={!worker}
          onSubmit={() => handleReceiptCreation()}
        >
          <ChooseWorker
            workers={workers.filter(
              (w) => w.manager.managerModelName === FINANCIAL_MANAGER,
            )}
            onChoose={(e) => {
              const { value } = e.target;
              setWorker(value);
            }}
            managerModelName={FINANCIAL_MANAGER}
          />
        </FormModal>
      )}
    </>
  );
};

const SourceList = ({ sources }) => {
  return (
    <div className="flex flex-col w-full mt-2 gap-4">
      {sources.map((source) => {
        return (
          <ListItem key={source._id}>
            <div className=" p-4 rounded-xl w-1/6 min-w-fit" key={source._id}>
              <div className="font-bold">{source.product.name} {source.quantity}</div>
              <div>{source.warehouseStock.warehouse.name}</div>
            </div>
          </ListItem>
        );
      })}
    </div>
  );
};
