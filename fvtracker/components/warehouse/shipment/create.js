import { AppInput } from "@/components/form/inputs";
import { FormModal } from "@/components/layout/modals/form";
import {
  SHIPMENT_PENDING,
  SHIPMENT_SHIPPABLE,
  SHIPMENT_SHIPPED,
} from "@/lib/constants/warehouse/shipment";
import {
  calculateNeededQuantities,
  calculateWarehouseStock,
  isRequestFulfilled,
  submitShipment,
} from "@/lib/utils/storage/warehouse";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const CreateShipmentModal = ({
  isOpen,
  onCancel,
  warehouseRequestId,
  items,
  shipment: oldShipment,
  order,
}) => {
  console.log({ message: "old shipment", oldShipment });
  const dispatch = useDispatch();
  const emptyShipment = {
    warehouseRequestId,
    sources: [],
  };
  const [newShipmentData, setNewShipmentData] = useState(emptyShipment);
  const warehouses = useSelector((state) => state.warehouse.warehouses.items);
  const productQuantities = items.map((i) => ({
    productName: i.product,
    neededQuantity: i.quantity,
  }));
  useEffect(() => {
    console.log({ newShipmentData });
  }, [newShipmentData]);
  return (
    <FormModal
      isOpen={isOpen}
      onCancel={() => {
        setNewShipmentData(emptyShipment);
        onCancel();
      }}
      onSubmit={() => submitShipment({ shipment: newShipmentData, dispatch })}
      title="Otpremnica"
    >
      <ChooseWarehouseSources
        shipmentData={newShipmentData}
        setNewShipmentData={setNewShipmentData}
        warehouses={warehouses}
        productQuantities={productQuantities}
        shipmentItems={items}
        order={order}
        shipmentStatus={oldShipment?.status}
      />
    </FormModal>
  );
};

const ChooseWarehouseSources = ({
  shipmentItems,
  shipmentData,
  setNewShipmentData,
  warehouses,
  productQuantities,
  order,
  shipmentStatus,
}) => {
  const neededQuantities = calculateNeededQuantities({
    shipmentItems,
    shipment: shipmentData,
    order,
  });

  const sourceQuantity = ({ wh, productName }) =>
    shipmentData.sources.find(
      (s) => s.warehouseId === wh._id && s.productName === productName,
    )?.quantity || "";

  const setNewShipment = ({ w, pq, quantity }) => {
    const existingSource = shipmentData.sources.find(
      (s) => s.warehouseId === w._id && s.productName === pq.productName,
    );
    if (existingSource) {
      return setNewShipmentData((prev) => ({
        ...prev,
        sources: prev.sources.map((s) =>
          s.warehouseId === w._id && s.productName === pq.productName
            ? {
                ...s,
                quantity,
              }
            : s,
        ),
      }));
    } else {
      return setNewShipmentData((prev) => ({
        ...prev,
        sources: [
          ...newShipmentData.sources,
          {
            warehouseId: w._id,
            quantity,
            productName: pq.productName,
          },
        ],
      }));
    }
  };

  const neededString = neededQuantities
    .map((nq) => `${nq.productName}: ${nq.neededQuantity}`)
    .join(", ");

  return (
    <div>
      <div>Odarite skladišne izvore</div>
      <div>
        <ShipmentStatus status={getSipmentStatusText()} />
      </div>
      <div className="pt-4">
        {productQuantities.map((pq) => {
          return (
            <div className="" key={pq.productName}>
              <div className="font-bold">{pq.productName}</div>
              <div className="flex flex-col gap-2 pl-4">
                {warehouses.map((w) => {
                  const availableStock = calculateWarehouseStock({
                    productName: pq.productName,
                    stocks: w.stocks,
                  });
                  return (
                    <div
                      className="flex justify-between items-center"
                      key={w._id}
                    >
                      <div className="flex gap-2 items-center">
                        <div>{w.name}</div>
                        <div>
                          <span className="italic text-gray-500">
                            {sourceQuantity({
                              wh: w,
                              productName: pq.productName,
                            }) || 0}
                            {"/"}
                            {availableStock}
                          </span>
                        </div>
                      </div>
                      <div className="warehouse-quantities">
                        <input
                          className="inputRow p-1 w-12"
                          type="number"
                          value={sourceQuantity({
                            wh: w,
                            productName: pq.productName,
                          })}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              setNewShipment({ w, pq, quantity: 0 });
                              return;
                            }
                            const quantity = parseInt(e.target.value);
                            if (quantity > availableStock) {
                              alert("Nema toliko na skladištu");
                              return;
                            }

                            setNewShipment({ w, pq, quantity });
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ShipmentStatus = ({ shipment }) => {
  const getSipmentStatusText = () => {
    switch (shipment?.status) {
      case SHIPMENT_PENDING:
        return "Na čekanju";
      case SHIPMENT_SHIPPABLE:
        return "Spremno za otpremu";
      case SHIPMENT_SHIPPED:
        return "Otpremljeno";
      default:
        return `SHIPMENT STATUS ${shipmentStatus}`;
    }
  };
  return `Status: ${status}`;
};

const ShipmentPending = ({ shipmentItems }) => {
  return <div>Na čekanju</div>;
};
