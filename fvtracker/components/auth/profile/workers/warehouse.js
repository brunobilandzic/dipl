import {
  shipmentItemsProductSum,
  shipmentItemsShipmentItemsProductQuantity,
} from "@/lib/utils/workers/warehouse";
import { WorkerSectorInfoTitle } from ".";

export const WarehouseWorkerInfo = ({ shipmentItems }) => {
  const shippedPrducts =
    shipmentItemsShipmentItemsProductQuantity(shipmentItems);
  return (
    <div>
      <WorkerSectorInfoTitle title="Podaci o radu" />
      <div>Učinjeno otpremnica: {shipmentItems.length}</div>
      <div>Odaslano: {shipmentItemsProductSum(shipmentItems)} proizvoda</div>
      <div className="list-wrap">
        <div className="list-wrap-title">Odaslani proizvodi:</div>
        <ul className="list-wrap-list list-disc list-inside">
          {shippedPrducts.map((product) => (
            <li key={`${product.name}-${product.quantity}`}>
              {product.name}: {product.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
