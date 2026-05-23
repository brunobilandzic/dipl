import { showDate } from "@/lib/utils/display";
import { sortItems } from "@/lib/utils/list";
import { notFound } from "next/navigation";
import React from "react";

function ShipmentPageComponent({ shipment }) {
  if (!shipment) {
    return notFound();
  }

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
          <ShipmentItemList shipmentItems={shipmentItems} />
        </div>
      </div>
    </div>
  );
}

export default ShipmentPageComponent;

const ShipmentItemList = ({ shipmentItems }) => {
  const sortedShipmentItems = sortItems({
    items: shipmentItems,
    sortBy: "createdAt",
  });
  console.log({ sortedShipmentItems });
  return (
    <div>
      {sortedShipmentItems?.map((si) => (
        <ShipmentItem key={si._id} shipmentItem={si} />
      ))}
    </div>
  );
};

const ShipmentItem = ({ shipmentItem }) => {
  const { sources, receipt } = shipmentItem;
  return (
    <div>
      <div>
        <div>Pošiljka {showDate(shipmentItem.createdAt)}</div>
        <SourceList sources={sources} />
      </div>
    </div>
  );
};

const SourceList = ({ sources }) => {
  return (
    <div className="flex flex-col w-full bg-yellow-900">
      {sources.map((source) => (
        <div className="border p-4 rounded-xl w-1/6 min-w-fit" key={source._id}>
          <div>PROIZVOD: {source.product.name}</div>
          <div>KOLIČINA: {source.quantity}</div>
          <div>SKLADIŠTE: {source.warehouseStock.warehouse.name}</div>
        </div>
      ))}
    </div>
  );
};
