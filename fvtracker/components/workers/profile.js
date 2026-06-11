"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { LoadingFullScreen } from "../layout/loading";
import { fetchWorkerById } from "@/store/workers";
import { useSession } from "next-auth/react";
import { WORKER_TRANSLATION } from "@/lib/constants/users/workers";
import { shipmentItemsProductSum } from "@/lib/utils/workers/warehouse";
import { workerTotalPay } from "@/lib/utils/workers/pay";

export const WorkerProfile = () => {
  const { data: session } = useSession();
  const workerId = session?.user?.workerId;
  console.log("WorkerProfile session:", session);
  const worker = useSelector((state) => state.workers.worker);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (worker || !workerId) return;
    dispatch(fetchWorkerById(workerId));
  }, [worker, workerId]);
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
      <>{JSON.stringify(worker)}</>
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
    </div>
  );
};
