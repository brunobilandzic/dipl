"use client";

import { useSelector } from "react-redux";

import { LoadingFullScreen } from "../layout/loading";
import { WORKER_TRANSLATION } from "@/lib/constants/users/workers";
import {
  shipmentItemsProductSum,
  shipmentItemsShipmentItemsProductQuantity,
} from "@/lib/utils/workers/warehouse";
import { workerTotalPay } from "@/lib/utils/workers/pay";

export const WorkerProfile = () => {
  const workerType = useSelector((state) => state.user.session?.workerType);
  const worker = useSelector((state) => state.workers.worker);

  if (!worker) return <LoadingFullScreen />;
  return (
    <>
      <WorkerCommonInfo
        hourlyRate={worker.hourlyRate}
        payedAmount={worker.payedAmount}
        totalPay={workerTotalPay(worker).totalPay}
        totalHours={workerTotalPay(worker).totalHours}
      />
      <WorkerSectorInfo workerType={workerType}>
        {workerType === "WarehouseWorker" && (
          <WarehouseWorkerInfo shipmentItems={worker.shipmentItems} />
        )}
      </WorkerSectorInfo>
    </>
  );
};

export const WorkerCommonInfo = ({
  hourlyRate,
  payedAmount,
  totalPay,
  totalHours,
}) => {
  return (
    <div>
      <div className="flex flex-col  my-4">
        <p>Zarađeno: {totalPay} €</p>
        <p>Ukupno sati: {totalHours}</p>
        <p>Satnica: {hourlyRate} €/h</p>
        <p>Isplaćemo: {payedAmount} €</p>
      </div>
    </div>
  );
};

export const WorkerSectorInfo = ({ workerType, children }) => {
  return <div>{children}</div>;
};

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

export const CultivationWorkerInfo = ({ plantageWorks, harvestWorks }) => {
  console.log({
    plantageWorks,
    harvestWorks,
  });

  return (
    <div>
      <div>Obavljeno posla na plantaži: {plantageWorks.length}</div>
      <div>Obavljeno posla na žetvi: {harvestWorks.length}</div>
    </div>
  );
};
