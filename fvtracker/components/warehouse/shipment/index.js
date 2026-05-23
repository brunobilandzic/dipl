"use client";

import { ListItem } from "@/components/layout/preview/list";
import { FINANCIAL_MANAGER } from "@/lib/constants/users/managerTypes";
import { showDate, showDateTime } from "@/lib/utils/display";
import { sortItems } from "@/lib/utils/list";
import { notFound } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

function ShipmentPageComponent({ shipment }) {
  if (!shipment) {
    return notFound();
  }

  const managerModelName = useSelector(
    (state) => state.user?.session?.managerModelName,
  );
  console.log({ managerModelName });

  const { warehouseRequest, status, shipmentItems } = shipment;
  const { order } = warehouseRequest || {};
  const sources = shipmentItems.reduce(
    (acc, si) => [...acc, ...si.sources],
    [],
  );

  console.log({ sources });

  console.log({ shipmentPage: shipment });
  return (
    <div>
      <div>
        <div>NARUDŽBA: {order?.number}</div>
        <div>STATUS: {shipment?.status}</div>
        <div className="mt-4 pl-12">
          <ShipmentItemList
            managerModelName={managerModelName}
            shipmentItems={shipmentItems}
          />
        </div>
      </div>
    </div>
  );
}

export default ShipmentPageComponent;

const ShipmentItemList = ({ managerModelName, shipmentItems }) => {
  const sortedShipmentItems = sortItems({
    items: shipmentItems,
    sortBy: "createdAt",
  });
  console.log({ sortedShipmentItems });
  return (
    <div>
      {sortedShipmentItems?.map((si) => (
        <ShipmentItem
          key={si._id}
          shipmentItem={si}
          managerModelName={managerModelName}
        />
      ))}
    </div>
  );
};

const ShipmentItem = ({ shipmentItem, managerModelName }) => {
  const { sources, receipt, createdAt, _id } = shipmentItem;

  const actionOptions = [
    ...(managerModelName === FINANCIAL_MANAGER && !receipt
      ? [
          {
            label: "Izradi račun",
            onClick: (e) => {
              e.stopPropagation();
              console.log("Creating receipt for shipment item", shipmentItem);
            },
            className: "submitButton",
          },
        ]
      : []),
  ];
  return (
    <ListItem
      key={_id}
      actionOptions={actionOptions}
      title={`Pošiljka napravljena ${showDateTime(createdAt)}`}
    >
      <div>
        <strong>Stavke:</strong>
        <SourceList sources={sources} />
        <div></div>
      </div>
    </ListItem>
  );
};

const SourceList = ({ sources }) => {
  return (
    <div className="flex flex-col w-full mt-2 gap-4">
      {sources.map((source) => {
        return (
          <ListItem key={source._id}>
            <div className=" p-4 rounded-xl w-1/6 min-w-fit" key={source._id}>
              <div>PROIZVOD: {source.product.name}</div>
              <div>KOLIČINA: {source.quantity}</div>
              <div>SKLADIŠTE: {source.warehouseStock.warehouse.name}</div>
            </div>
          </ListItem>
        );
      })}
    </div>
  );
};
