import { FormModal } from "@/components/layout/modals/form";
import { useSelector } from "react-redux";

export const CreateShipmentModal = ({
  isOpen,
  onCancel,
  warehouseRequestId,
}) => {
  const [shipment, setShipment] = useState({
    warehouseRequestId,
    sources: [],
  });
  const warehouses = useSelector((state) => state.warehouse.warehouses);
  console.log({ warehouses });

  return (
    <FormModal isOpen={isOpen} onCancel={onCancel}>
      <ChooseWarehouseSources shipment={shipment} setShipment={setShipment} />
    </FormModal>
  );
};

const ChooseWarehouseSources = ({ shipment, setShipment }) => {
  return (
    <div>
      <div>Odarite skladišne izvore</div>
      <div>
        {warehouses.map((warehouse) => (
          <div key={warehouse.id}>
            <div>{warehouse.name}</div>
            <div>
              <input
                type="number"
                value={shipment.sources[warehouse.id] || 0}
                onChange={(e) =>
                  setShipment({
                    ...shipment,
                    sources: {
                      ...shipment.sources,
                      [warehouse.id]: parseInt(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
