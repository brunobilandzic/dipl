import { AppInput } from "@/components/form/inputs";
import { FormModal } from "@/components/layout/modals/form";
import { calculateWarehouseStock } from "@/lib/utils/storage/warehouse";
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
      />
    </FormModal>
  );
};

const ChooseWarehouseSources = ({
  shipment,
  setShipment,
  warehouses,
  productQuantities,
}) => {
  console.log({ shipment, warehouses });

  return (
    <div>
      <div>Odarite skladišne izvore</div>
      <div>Potrebno je još: </div>
      <div>
        {productQuantities.map((pq) => {
          return (
            <div key={pq.productName}>
              <div>{pq.productName}</div>
              {warehouses.map((w) => {
                const availableStock = calculateWarehouseStock({
                  productName: pq.productName,
                  stocks: w.stocks,
                });
                return (
                  <div key={w.id}>
                    <div>{w.name}</div>
                    <div>{availableStock}</div>
                    <AppInput
                      type="number"
                      value={
                        shipment.sources.find((s) => s.warehouseId === w.id)
                          ?.quantity || ""
                      }
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value);
                        if (quantity > availableStock) {
                          alert("Nema toliko na skladištu");
                          return;
                        }
                        setShipment((prev) => {
                          const existingSource = prev.sources.find(
                            (s) => s.warehouseId === w.id,
                          );
                          if (existingSource) {
                            return {
                              ...prev,
                              sources: prev.sources.map((s) =>
                                s.warehouseId === w.id
                                  ? { warehouseId: w.id, quantity }
                                  : s,
                              ),
                            };
                          } else {
                            return {
                              ...prev,
                              sources: [
                                ...prev.sources,
                                { warehouseId: w.id, quantity },
                              ],
                            };
                          }
                        });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
