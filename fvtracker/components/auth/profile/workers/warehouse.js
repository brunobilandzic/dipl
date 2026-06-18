import { shipmentItemsShipmentItemsProductQuantity } from "@/lib/utils/workers/warehouse";

export const WarehouseWorkerInfo = ({ shipmentItems }) => {
  const shippedPrducts =
    shipmentItemsShipmentItemsProductQuantity(shipmentItems);
  return (
    <div>
      <div>Učinjeno otpremnica: {shipmentItems.length}</div>
      <div>Odaslano: {shipmentItemsProductSum(shipmentItems)} proizvoda</div>
      <div>
        <h4>Proizvodi:</h4>
        <ul className="list-disc list-inside">
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
