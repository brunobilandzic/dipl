"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { useDispatch, useSelector } from "react-redux";
import { List, ListItem } from "../layout/preview/list";
import { useRouter } from "next/navigation";
import { showDate } from "@/lib/utils/display";
import {
  workPayCultivation,
  workPayProduction,
  workPayWarehouse,
  workPayFinancial,
} from "@/lib/utils/workers/pay";
import { worksCoordsSum } from "@/lib/utils/workers/cultivation";
import {
  CULTIVATION_MANAGER,
  FINANCIAL_MANAGER,
  GENERAL_MANAGER,
  PRODUCTION_MANAGER,
  WAREHOUSE_MANAGER,
} from "@/lib/constants/users/managerTypes";
import { useEffect, useState } from "react";
import { PayWorkerModal } from "./pay";
import { SORT_INIT_VALUE } from "@/lib/constants/others";
import { initFilters } from "@/lib/utils/list";
import { workerSortOptions } from "../layout/preview/sort";
import { filterWorkers } from "@/store/workers";

export const WorkersPageComponent = ({ managerModelName }) => {
  const allWorkers = [GENERAL_MANAGER, FINANCIAL_MANAGER].includes(
    managerModelName,
  );
  const workersState = useSelector((state) => state.workers);
  const {
    items: workers,
    filteredItems: displayedWorkers,
    isLoading,
  } = workersState;
  const router = useRouter();
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState(SORT_INIT_VALUE);
  const [filters, setFilters] = useState(initFilters("workers", allWorkers));

  useEffect(() => {
    if (workers) {
      dispatch(filterWorkers({ filters, sortBy }));
    }
  }, [filters, sortBy]);

  if (!workers) return <LoadingFullScreen />;

  return (
    <div>
      <div>
        <List
          title="Radnici"
          addLabel="Dodaj radnika"
          onCreateItem={
            managerModelName != GENERAL_MANAGER
              ? () => router.push("/radnici/izradi")
              : undefined
          }
          sortBy={sortBy}
          setSortBy={setSortBy}
          filters={filters}
          setFilters={setFilters}
          initialFilters={initFilters("workers")}
          sortOptions={workerSortOptions}
        >
          {displayedWorkers.map((worker) => (
            <WorkerItem key={worker._id} worker={worker}>
              <WorkerContent
                worker={worker}
                managerModelName={worker.manager.managerModelName}
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
    case FINANCIAL_MANAGER:
      return <FinancialWorker worker={worker} />;
    default:
      return null;
  }
}

const CultivationWorker = ({ worker }) => {
  const { totalHours, totalPay } = workPayCultivation({
    hourlyRate: worker.hourlyRate,
    works: [...worker.plantageWorks, ...worker.harvestWorks],
  });
  return (
    <>
      <div>
        Zarađeno: {totalPay} €, ukupno sati: {totalHours} h, isplaćeno:{" "}
        {worker.payedAmount} €
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
  const { totalHours, totalPay } = workPayProduction({
    hourlyRate: worker.hourlyRate,
    processes: [
      ...worker.productionProcesses,
      ...worker.warehouseAcceptanceProcesses,
    ],
  });
  return (
    <>
      <div>
        Ukupno: {totalPay} €, ukupno sati: {totalHours} h, isplaćeno:{" "}
        {worker.payedAmount} €
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
  const { totalHours, totalPay } = workPayWarehouse({
    hourlyRate: worker.hourlyRate,
    shipmentItems: worker.shipmentItems,
  });
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
        Ukupna zarada: {totalPay} €, ukupno sati: {totalHours} h, isplaćeno:{" "}
        {worker.payedAmount} €
      </div>
    </>
  );
};

const FinancialWorker = ({ worker }) => {
  const shipmentItems = worker.warehouseRequests.reduce((items, request) => {
    console.log({ request });
    items.push(...request.shipment.shipmentItems);
    return items;
  }, []);
  const sources = shipmentItems.reduce((sources, item) => {
    sources.push(...item.sources);
    return sources;
  }, []);
  return (
    <>
      <div>
        Ukupno poslanih zahtjeva: {worker.warehouseRequests.length} zahtjeva,
        ukupna količina proizvoda:{" "}
        {sources.reduce((itemSum, item) => itemSum + item.quantity, 0)}
      </div>
      <div>Ukupno kreirano računa: {worker.receipts.length} računa</div>
    </>
  );
};
