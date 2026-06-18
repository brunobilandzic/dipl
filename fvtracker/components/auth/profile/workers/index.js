"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import {
  shipmentItemsProductSum,
  shipmentItemsShipmentItemsProductQuantity,
} from "@/lib/utils/workers/warehouse";
import { workerTotalPay } from "@/lib/utils/workers/pay";
import { CultivationWorkerInfo } from "@/components/auth/profile/workers/cultivation";
import { WarehouseWorkerInfo } from "./warehouse";

export const WorkerProfile = ({ worker, workerType }) => {
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
        {workerType === "CultivationWorker" && (
          <CultivationWorkerInfo
            plantageWorks={worker.plantageWorks}
            harvestWorks={worker.harvestWorks}
          />
        )}
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
      <WorkerSectorInfoTitle title="Zarada" />
      <div className="">
        <p>Zarađeno: {totalPay} €</p>
        <p>Ukupno sati: {totalHours}</p>
        <p>Satnica: {hourlyRate} €/h</p>
        <p>Isplaćemo: {payedAmount} €</p>
      </div>
    </div>
  );
};

export const WorkerSectorInfo = ({ workerType, children }) => {
  return <div className="worker-sector-info">{children}</div>;
};

export const WorkerSectorInfoTitle = ({ title }) => {
  return <div className="info-group-title">{title}</div>;
};
