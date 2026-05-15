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
        {warehouses.map((warehouse) => {
          const stockStatus = calculateWarehouseStock({
            productQuantities,
            stocks: warehouse.stocks,
          });

          return (
            <div
              key={warehouse._id}
              className="flex justify-between gap-2 overflow-hidden items-center py-2"
            >
              <div>{warehouse.name}</div>
              <div>Stanje: {stockStatus}</div>
              <div className="w-16">
                <AppInput
                  type="number"
                  value={shipment.sources[warehouse._id] || ""}
                  onChange={(e) => {
                    if (parseInt(e.target.value) > stockStatus) {
                      alert("Nema dovoljno zaliha u ovom skladištu");
                      return;
                    }
                    setShipment({
                      ...shipment,
                      sources: {
                        ...shipment.sources,
                        [warehouse._id]: parseInt(e.target.value) || 0,
                      },
                    });
                  }}
                  max={stockStatus}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
