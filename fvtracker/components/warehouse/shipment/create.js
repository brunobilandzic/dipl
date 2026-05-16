import { AppInput } from "@/components/form/inputs";
import { FormModal } from "@/components/layout/modals/form";
import {
  calculateNeededQuantities,
  calculateWarehouseStock,
} from "@/lib/utils/storage/warehouse";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const CreateShipmentModal = ({
  isOpen,
  onCancel,
  warehouseRequestId,
  items,
}) => {
  const [shipment, setShipment] = useState({
    warehouseRequestId,
    sources: [],
  });
  const warehouses = useSelector((state) => state.warehouse.warehouses.items);
  console.log({ items });
  const productQuantities = items.map((i) => ({
    productName: i.product,
    neededQuantity: i.quantity,
  }));
  useEffect(() => {
    console.log({ shipment });
  }, [shipment]);
  return (
    <FormModal isOpen={isOpen} onCancel={onCancel}>
      <ChooseWarehouseSources
        shipment={shipment}
        setShipment={setShipment}
        warehouses={warehouses}
        productQuantities={productQuantities}
        orderItems={items}
      />
    </FormModal>
  );
};

const ChooseWarehouseSources = ({
  orderItems,
  shipment,
  setShipment,
  warehouses,
  productQuantities,
}) => {
  const neededQuantities = calculateNeededQuantities({
    orderItems,
    shipment,
  });

  const sourceQuantity = ({ wh, productName }) =>
    shipment.sources.find(
      (s) => s.warehouseId === wh._id && s.productName === productName,
    )?.quantity || "";
  const neededString = neededQuantities
    .map((nq) => `${nq.productName}: ${nq.neededQuantity}`)
    .join(", ");

  return (
    <div>
      <div>Odarite skladišne izvore</div>
      <div>Potrebno je još: {neededString}</div>
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
                            const quantity = parseInt(e.target.value);
                            if (quantity > availableStock) {
                              alert("Nema toliko na skladištu");
                              return;
                            }
                            const newShipment = (() => {
                              const existingSource = shipment.sources.find(
                                (s) =>
                                  s.warehouseId === w._id &&
                                  s.productName === pq.productName,
                              );
                              if (existingSource) {
                                return {
                                  ...shipment,
                                  sources: shipment.sources.map((s) =>
                                    s.warehouseId === w._id
                                      ? {
                                          ...s,
                                          quantity,
                                        }
                                      : s,
                                  ),
                                };
                              } else {
                                return {
                                  ...shipment,
                                  sources: [
                                    ...shipment.sources,
                                    {
                                      warehouseId: w._id,
                                      quantity,
                                      productName: pq.productName,
                                    },
                                  ],
                                };
                              }
                            })();
                            setShipment(newShipment);
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
