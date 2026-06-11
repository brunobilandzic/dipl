"use client";

import {  useSelector } from "react-redux";

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
        name={worker.appUser.name}
        surname={worker.appUser.surname}
        email={worker.appUser.email}
        status={worker.employmentRequest.status}
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

const WorkerCommonInfo = ({
  name,
  surname,
  email,
  status,
  hourlyRate,
  payedAmount,
  totalPay,
  totalHours,
}) => {
  return (
    <div>
      <div className="text-2xl font-bold">Osobni podaci</div>
      <div className="flex flex-col  my-4">
        <h2>
          {name} {surname}
        </h2>
        <p>Email: {email}</p>
        <p>Status: {WORKER_TRANSLATION[status]}</p>
        <p>Zarađeno: {totalPay} €</p>
        <p>Ukupno sati: {totalHours}</p>
        <p>Satnica: {hourlyRate} €/h</p>
        <p>Isplaćemo: {payedAmount} €</p>
      </div>
    </div>
  );
};

const WorkerSectorInfo = ({ workerType, children }) => {
  return (
    <div>
      <h3 className="text-lg">{WORKER_TRANSLATION[workerType]}</h3>
      {children}
    </div>
  );
};

const WarehouseWorkerInfo = ({ shipmentItems }) => {
  const shippedPrducts =
    shipmentItemsShipmentItemsProductQuantity(shipmentItems);
  console.log("WarehouseWorkerInfo shipmentItems:", shipmentItems);
  console.log("WarehouseWorkerInfo shippedProducts:", shippedPrducts);
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
