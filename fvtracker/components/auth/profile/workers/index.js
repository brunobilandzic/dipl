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

const CommonProfilePage = ({
  email,
  employed,
  workerType,
  managerModelName,
  isAdmin,
  roleStatus,
  name,
  username,
}) => {
  const profileRole = () => {
    if (isAdmin) {
      return "Administrator";
    } else if (workerType) {
      return (
        <>
          <div>{WORKER_TRANSLATION[workerType]}</div>
          <div>{employed ? "Zaposlen" : "Nezaposlen"}</div>
        </>
      );
    } else if (managerModelName) {
      return (
        <>
          <div>{MANAGER_TRANSLATION[managerModelName]}</div>
          <div>
            Zahtjev za ulogu:{" "}
            {roleStatus === ROLE_STATUSES.APPROVED ? "Odobren" : "Nije odobren"}
          </div>
        </>
      );
    }
  };
  return (
    <div>
      <div className="text-2xl font-bold underline">{name}</div>
      <div>{profileRole()}</div>
      <div>Korisničko ime: {username}</div>
      <div>Email: {email}</div>
    </div>
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
