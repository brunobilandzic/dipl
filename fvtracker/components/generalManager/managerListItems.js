import { useSelector } from "react-redux";
import { LoadingFullScreen } from "../layout/loading";
import { ManagerWorkers } from "./managerWorkers";
import {
  EMPLOYMENT_STATUS_EMPLOYED,
  EMPLOYMENT_STATUS_PENDING,
  EMPLOYMENT_STATUS_UNEMPLOYED,
} from "@/lib/constants/users/workers";
import { workerTotalPay, workPayWarehouse } from "@/lib/utils/workers/pay";

export const CultivationManagerListItem = ({ workers }) => {
  const fields = useSelector((state) => state.cultivation.fields);
  if (!fields) return <LoadingFullScreen />;
  return (
    <div className="listitemDescription">
      <div> Kreirano polja: {fields.length}</div>
      <div>
        Kreirano polja za gredice:{" "}
        {fields.flatMap((field) => field.cultivationAreas).length}
      </div>
      <div>
        Kreirano gredica:{" "}
        {
          fields
            .flatMap((field) => field.cultivationAreas)
            .flatMap((area) => area.cultivations).length
        }
      </div>
      <ManagerWorkers
        workers={workers}
        paySum={workers.reduce(
          (total, worker) =>
            total +
            (worker.plantageWorks.length + worker.harvestWorks.length) *
              worker.hourlyRate,
          0,
        )}
      />
    </div>
  );
};

export const FinancialManagerListItem = ({ workers, allWorkers }) => {
  const procurments = useSelector((state) => state.procurments.items);
  if (!procurments) return <LoadingFullScreen />;
  console.log({ allWorkers });
  console.log({ workers });
  return (
    <div className="listitemDescription">
      <div>
        {" "}
        Zaposleno radnika ukupno:{" "}
        {
          allWorkers.filter(
            (w) => w.employmentRequest?.status === EMPLOYMENT_STATUS_EMPLOYED,
          ).length
        }
      </div>
      <div>
        Ukupno radnika na čekanju:{" "}
        {
          allWorkers.filter(
            (w) => w.employmentRequest?.status === EMPLOYMENT_STATUS_PENDING,
          ).length
        }
      </div>
      <div>
        Ukupno radnika otpušteno:{" "}
        {
          allWorkers.filter(
            (w) => w.employmentRequest?.status === EMPLOYMENT_STATUS_UNEMPLOYED,
          ).length
        }
      </div>
      <div>Zarada ukupno: {allWorkers.reduce((total, worker) => total + workerTotalPay(worker).totalPay, 0)} €</div>
      <ManagerWorkers
        workers={workers}
        paySum={workers.reduce(
          (total, worker) =>
            total +
            (worker.receipts.length + worker.warehouseRequests.length) *
              worker.hourlyRate,
          0,
        )}
      />
    </div>
  );
};

export const WarehouseManagerListItem = ({ workers, warehouseRequests }) => {
  const warehouses = useSelector((state) => state.warehouse.warehouses.items);
  if (!warehouses) return <LoadingFullScreen />;
  console.log({ warehouseRequests });
  return (
    <>
      <div className="listitemDescription">
        <div>
          Izrašeno {warehouses.length} skladišta, ukupno:{" "}
          {warehouses.reduce((count, wh) => count + wh.volume, 0)} m³
        </div>
        <div>Zaprimljeno {warehouseRequests.length} zahtjeva za isporuku</div>
        <div>
          Kreirano otpremnica:{" "}
          {workers.reduce((count, w) => count + w.shipmentItems.length, 0)}
        </div>
        <div>
          Poslano proizvoda:{" "}
          {workers.reduce(
            (count, w) =>
              count +
              w.shipmentItems.reduce(
                (count, si) =>
                  count + si.sources.reduce((c, s) => c + s.quantity, 0),
                0,
              ),
            0,
          )}
        </div>
        <ManagerWorkers
          workers={workers}
          paySum={workers.reduce((total, worker) => {
            const { totalPay } = workPayWarehouse({
              hourlyRate: worker.hourlyRate,
              shipmentItems: worker.shipmentItems,
            });
            return total + totalPay;
          }, 0)}
        />
      </div>
    </>
  );
};
