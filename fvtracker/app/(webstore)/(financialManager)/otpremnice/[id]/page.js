import ShipmentPageComponent from "@/components/warehouse/shipment";
import React from "react";

async function ShipmentPage({ params }) {
  const { id } = await params;
  const shipment = await getShipmentById({ id });
  return (
    <div>
      <ShipmentPageComponent shipment={shipment} />
    </div>
  );
}

export default ShipmentPage;
