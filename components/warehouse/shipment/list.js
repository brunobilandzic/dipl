import { useSelector } from "react-redux";

export const ShipmentList = ({}) => {
  const shipments = useSelector(
    (state) => state.webstore.shipments.filteredItems,
  );
  return (
    <div>
      {shipments.map((shipment) => (
        <div key={shipment._id}>
          <div>Narudzba: {shipment.warehouseRequest?.order?.number}</div>
        </div>
      ))}
    </div>
  );
};
