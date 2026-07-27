import { AppInput } from "@/components/form/inputs";
import { FormModal } from "@/components/layout/modals/form";
import { ChooseWorker } from "@/components/workers/choose";
import {
  SHIPMENT_PENDING,
  SHIPMENT_SHIPPED_FULLY,
  SHIPMENT_SHIPPED_PARTLY,
} from "@/lib/constants/warehouse/shipment";
import {
  calculateNeededQuantities,
  calculateWarehouseStock,
  isRequestFulfilled,
  submitShipment,
} from "@/lib/utils/storage/warehouse";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkEmpty } from "@/lib/utils/objects";
import { WAREHOUSE_MANAGER } from "@/lib/constants/users/managerTypes";
import { checkValue } from "@/lib/utils/formValidation";
import { AppTable } from "@/components/layout/preview/table";

export const CreateShipmentModal = ({
  isOpen,
  onCancel,
  warehouseRequestId,
  shipmentItems,
  oldShipment,
  order,
  router,
}) => {
  const workers = useSelector((state) => state.workers.items);
  const worker = useSelector((state) => state.workers.worker);

  const dispatch = useDispatch();
  const emptyShipment = {
    warehouseRequestId,
    sources: [],
    workerId: worker?._id || null,
  };
  const [newShipmentData, setNewShipmentData] = useState(emptyShipment);
  const warehouses = useSelector((state) => state.warehouse.warehouses.items);
  const productQuantities = shipmentItems.map((i) => ({
    productName: i.product,
    neededQuantity: i.quantity,
  }));

  useEffect(() => {
    if (worker) {
      setNewShipmentData((prev) => ({
        ...prev,
        workerId: worker._id,
      }));
    }
  }, [worker]);

  const chooseWorker = (e) => {
    const { name, value } = e.target;
    setNewShipmentData((prev) => ({
      ...prev,
      workerId: value,
    }));
  };

  return (
    <FormModal
      isOpen={isOpen}
      onCancel={() => {
        setNewShipmentData(emptyShipment);
        onCancel();
      }}
      onSubmit={() =>
        submitShipment({ newShipmentData, worker, dispatch, router })
      }
      title="Otpremnica"
      submitDisabled={checkEmpty(newShipmentData, true)}
    >
      {!worker && (
        <ChooseWorker
          workers={workers}
          onChoose={chooseWorker}
          managerModelName={WAREHOUSE_MANAGER}
        />
      )}
      <ChooseWarehouseSources
        newShipmentData={newShipmentData}
        setNewShipmentData={setNewShipmentData}
        warehouses={warehouses}
        productQuantities={productQuantities}
        shipmentItems={shipmentItems}
        order={order}
        shipmentStatus={oldShipment?.status}
      />
    </FormModal>
  );
};

const ChooseWarehouseSources = ({
  shipmentItems,
  newShipmentData,
  setNewShipmentData,
  warehouses,
  productQuantities,
  order,
  shipmentStatus,
}) => {
  const neededQuantities = calculateNeededQuantities({
    shipmentItems,
    newShipmentData,
    order,
  });

  const isFullfilled = isRequestFulfilled({
    neededQuantities,
    newShipmentData,
  });

  const sourceQuantity = ({ wh, productName }) =>
    newShipmentData.sources.find(
      (s) => s.warehouseId === wh._id && s.productName === productName,
    )?.quantity || "";

  const setNewShipment = ({ w, pq, quantity }) => {
    const existingSource = newShipmentData.sources.find(
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

  const neededString =
    "Tražene količine: " +
    neededQuantities
      .map((nq) => `${nq.productName}: ${nq.neededQuantity}`)
      .join(", ");

  return (
    <div>
      <div>
        <ShipmentStatus
          status={shipmentStatus}
          shipmentItems={shipmentItems}
          isFullfilled={isFullfilled}
          neededQuantities={neededQuantities}
        />
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
                          className="inputRow inputText p-1 w-12"
                          type="number"
                          value={sourceQuantity({
                            wh: w,
                            productName: pq.productName,
                          })}
                          onChange={(e) => {
                            const { value, error } = checkValue(e.target.value);
                            if (error) {
                              alert(error);
                              setNewShipment({ w, pq, quantity: value });
                              return;
                            }

                            const remainingNeeded =
                              neededQuantities.find(
                                (nq) => nq.productName === pq.productName,
                              )?.neededQuantity ?? 0;

                            const current =
                              Number(
                                sourceQuantity({
                                  wh: w,
                                  productName: pq.productName,
                                }),
                              ) || 0;
                            const maxForThisInput = remainingNeeded + current;

                            const quantity = parseInt(value);

                            if (quantity > availableStock) {
                              alert("Nema toliko na skladištu");
                              return;
                            }
                            if (quantity > maxForThisInput) {
                              alert("Ne treba toliko proizvoda");
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

const ShipmentStatus = ({ status, neededQuantities, isFullfilled }) => {
  if (status === SHIPMENT_SHIPPED_FULLY) return "Otpremljeno";

  if (isFullfilled)
    return <div className="text-green-600 font-bold">Zahtjev je ispunjen</div>;
  switch (status) {
    case SHIPMENT_SHIPPED_PARTLY:
      return <NeededTable neededQuantities={neededQuantities} />;
    case SHIPMENT_SHIPPED_FULLY:
      return "Otpremljeno";
    case SHIPMENT_PENDING:
      return <NeededTable neededQuantities={neededQuantities} />;
    default:
      return `SHIPMENT STATUS ${status}`;
  }
};

const NeededTable = ({ neededQuantities }) => {
  return (
    <AppTable
      headerLabels={["Proizvod", "Količina naručena", "Količina potrebna"]}
      rows={neededQuantities.map((nq) => ({
        Proizvod: nq.productName,
        "Količina naručena": nq.orderedQuantity,
        "Količina potrebna": nq.neededQuantity,
      }))}
    />
  );
};
