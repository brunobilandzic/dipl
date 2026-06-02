"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { useSelector } from "react-redux";
import { List, ListItem } from "../layout/preview/list";
import { useRouter } from "next/navigation";
import { showDate } from "@/lib/utils/display";
import { workPayCultivation, workPayProduction } from "@/lib/utils/workers/pay";
import { worksCoordsSum } from "@/lib/utils/workers/cultivation";
import {
  CULTIVATION_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";
import { useState } from "react";
import { PayWorkerModal } from "./pay";

export const WorkersPageComponent = ({ managerModelName }) => {
  const workersState = useSelector((state) => state.workers);
  const { items: workers, isLoading } = workersState;
  const router = useRouter();

  if (!workers) return <LoadingFullScreen />;

  return (
    <div>
      <div>
        <List
          title="Radnici"
          addLabel="Dodaj radnika"
          onCreateItem={() => router.push("/radnici/izradi")}
        >
          {workers.map((worker) => (
            <WorkerItem key={worker._id} worker={worker}>
              <WorkerContent
                worker={worker}
                managerModelName={managerModelName}
              />
            </WorkerItem>
          ))}
        </List>
      </div>
    </div>
  );
};

const WorkerItem = ({ worker, children }) => {
  const [showPayModal, setShowPayModal] = useState(false);

  return (
    <>
      <ListItem
        title={``}
        actionOptions={[
          {
            label: "Isplati",
            onClick: () => setShowPayModal(true),
            className: "submitButton",
          },
        ]}
      >
        <div>
          <div>
            <div>
              {worker.appUser.name} {worker.appUser.surname}
            </div>
            <div className="text-sm text-gray-500">
              {showDate(worker.createdAt)}
            </div>
            <div>Isplaćeno: {worker.payedAmount} €</div>
            <div>{worker.hourlyRate} $/h</div>
          </div>

          {children}
        </div>
      </ListItem>
      {showPayModal && (
        <PayWorkerModal
          worker={worker}
          onClose={() => setShowPayModal(false)}
        />
      )}
    </>
  );
};

function WorkerContent({ worker, managerModelName }) {
  switch (managerModelName) {
    case CULTIVATION_MANAGER:
      return <CultivationWorker worker={worker} />;
    case PRODUCTION_MANAGER:
      return <ProductionWorker worker={worker} />;
    case WAREHOUSE_MANAGER:
      return <WarehouseWorker worker={worker} />;
    default:
      return null;
  }
}

const CultivationWorker = ({ worker }) => {
  return (
    <>
      <div>
        {workPayCultivation({
          hourlyRate: worker.hourlyRate,
          works: [...worker.plantageWorks, ...worker.harvestWorks],
        })}{" "}
        € ukupno
      </div>
      <div>
        Zasađeno: {worksCoordsSum({ works: worker.plantageWorks, plant: true })}
      </div>
      <div>
        Ubrano: {worksCoordsSum({ works: worker.harvestWorks, plant: false })}
      </div>
      <div>{worker.plantageWorks.length} sadnji</div>
      <div>{worker.harvestWorks.length} berbi</div>
    </>
  );
};

const ProductionWorker = ({ worker }) => {
  return (
    <>
      <div>
        Ukupno:{" "}
        {workPayProduction({
          hourlyRate: worker.hourlyRate,
          processes: [
            ...worker.productionProcesses,
            ...worker.warehouseAcceptanceProcesses,
          ],
        })}
        $
      </div>
      <div>
        Proizvodnja: {worker.productionProcesses.length} procesa, količina:{" "}
        {worker.productionProcesses.reduce(
          (sum, process) => sum + process.quantity,
          0,
        )}
      </div>
      <div>
        Prijem: {worker.warehouseAcceptanceProcesses.length} procesa, količina:{" "}
        {worker.warehouseAcceptanceProcesses.reduce(
          (sum, process) => sum + process.quantity,
          0,
        )}
      </div>
    </>
  );
};

const WarehouseWorker = ({ worker }) => {
  return (
    <>
      <div>
        Ukupno kreirano otpremnica: {worker.shipmentItems.length} otpremnica,
        ukupna količina:{" "}
        {worker.shipmentItems.reduce((sum, process) => {
          return (
            sum +
            process.sources.reduce(
              (sourceSum, source) => sourceSum + source.quantity,
              0,
            )
          );
        }, 0)}
      </div>
      <div>
        Ukupna zarada:{" "}
        {worker.shipmentItems.reduce((sum, process) => {
          const processPay = process.sources.reduce(
            (sourceSum, source) =>
              sourceSum + source.quantity * worker.hourlyRate,
            0,
          );
          return sum + processPay;
        }, 0)}{" "}
        $
      </div>
    </>
  );
};
