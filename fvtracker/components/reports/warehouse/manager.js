"use client";

import { useSelector } from "react-redux";
import { ReportItem, ReportSection, ReportSector } from "../dashboard";
import { getWarehousesOccupiedVolume } from "@/lib/utils/storage/warehouse";
import { stringQuant } from "@/lib/utils/strings";
import { getshipmentSourcesCount } from "@/lib/utils/webstore/shipments";
import { LoadingFullScreen } from "@/components/layout/loading";

export const WarehouseReport = ({}) => {
  const warehouses = useSelector((state) => state.warehouse?.warehouses.items);
  const warehouseRequests = useSelector(
    (state) => state.warehouse?.warehouseRequests,
  );
  if (!warehouses || !warehouseRequests) return <LoadingFullScreen />;
  const occupiedVolume = getWarehousesOccupiedVolume(warehouses);

  const productsCount = warehouses.flatMap((wh) => wh.stocks).length;
  const shipmentItems = warehouseRequests.flatMap(
    (req) => req.shipment.shipmentItems,
  );
  const shipmentSourcesCount = getshipmentSourcesCount(shipmentItems);
  const orderedProductsCount = warehouseRequests
    .flatMap((req) => req.order)
    .flatMap((order) => order.items)
    .reduce((total, item) => total + item.quantity, 0);

  return (
    <ReportSector title="Skladište">
      <ReportSection title="Skladišta">
        <ReportItem description="Skladišta" count={warehouses?.length || 0} />
        <ReportItem
          description="Ukupni kapacitet"
          count={warehouses?.reduce((total, wh) => total + wh.volume, 0) || 0}
        />
        <ReportItem description="Zauzeti volumen" count={occupiedVolume} />
        <ReportItem
          description="Slobodni volumen"
          count={
            warehouses?.reduce((total, wh) => total + wh.volume, 0) -
              occupiedVolume || 0
          }
        />
        <ReportItem
          description="Proizvoda u skladištima"
          count={productsCount}
        />
      </ReportSection>
      <ReportSection title="Isporuke">
        <ReportItem
          count={warehouseRequests?.length || 0}
          description={stringQuant({
            string: "Zahtjev",
            quantity: warehouseRequests?.length || 0,
            pluralLetter: "i",
          })}
        />
        <ReportItem
          count={orderedProductsCount}
          description="Naručeno proizvoda"
        />
        <ReportItem count={shipmentSourcesCount} description="Isporučeno" />
      </ReportSection>
    </ReportSector>
  );
};
