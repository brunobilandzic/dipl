"use client";

import { LoadingFullScreen } from "@/components/layout/loading";
import { useDispatch, useSelector } from "react-redux";
import { List, ListItem } from "../layout/preview/list";
import { useRouter } from "next/navigation";
import { showDate, showDateTime } from "@/lib/utils/display";
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
import { useEffect, useState, useMemo } from "react";
import { PayWorkerModal } from "./pay";
import { SORT_INIT_VALUE } from "@/lib/constants/others";
import { initFilters } from "@/lib/utils/list";
import { workerSortOptions } from "../layout/preview/sort";
import { filterWorkers } from "@/store/workers";
import {
  EMPLOYMENT_STATUS_EMPLOYED,
  EMPLOYMENT_STATUS_UNEMPLOYED,
} from "@/lib/constants/users/workers";
import { handleStatusChange } from "@/lib/utils/workers/employment";

export const WorkersPageComponent = ({ managerModelName, isAdmin }) => {
  const allWorkers =
    [GENERAL_MANAGER, FINANCIAL_MANAGER].includes(managerModelName) || isAdmin;
  const workersState = useSelector((state) => state.workers);
  const {
    items: workers,
    filteredItems: displayedWorkers,
    isLoading,
  } = workersState;
  const router = useRouter();
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState(SORT_INIT_VALUE);
  const initialFilters = useMemo(
    () => initFilters("workers", allWorkers),
    [allWorkers],
  );
  const [filters, setFilters] = useState(initialFilters);

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
          onCreateItem={() => router.push("/radnici/izradi")}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filters={filters}
          setFilters={setFilters}
          initialFilters={initialFilters}
          sortOptions={workerSortOptions}
        >
          {" "}
          {displayedWorkers.length === 0 && (
            <div className="p-4 text-center text-gray-500">Nema radnika</div>
          )}
          {displayedWorkers.map((worker) => (
            <WorkerItem
              key={worker._id}
              worker={worker}
              dispatch={dispatch}
              router={router}
            >
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

const WorkerItem = ({ worker, children, dispatch, router }) => {
  const [showPayModal, setShowPayModal] = useState(false);
  const employed =
    worker.employmentRequest.status === EMPLOYMENT_STATUS_EMPLOYED;
  return (
    <>
      <ListItem
        title={``}
        actionOptions={[
          ...(employed
            ? [
                {
                  label: "Isplati",
                  onClick: () => setShowPayModal(true),
                  className: "submitButton",
                },
                {
                  label: "Otkaz",
                  onClick: () => {
                    handleStatusChange({
                      requestId: worker.employmentRequest._id,
                      status: EMPLOYMENT_STATUS_UNEMPLOYED,
                      dispatch,
                      router,
                    });
                  },
                  className: "cancelButton",
                },
              ]
            : []),
        ]}
      >
        <div>
          <div>
            <div>
              {worker.appUser.name} {worker.appUser.surname} -{" "}
              {worker.appUser.username}
            </div>
            <div className="text-sm text-gray-500">
              {showDate(worker.createdAt)}
            </div>

            <div className="info-group">
              <div>{employed ? "Zaposlen" : "Nezaposlen"} </div>
              <div>Zarađeno: {worker.earnedAmount || 0} €</div>
              <div>Ukupno sati: {worker.totalHours || 0} h</div>
            </div>
            <div>Isplaćeno: {worker.payedAmount || 0} €</div>
            <div>{worker.hourlyRate} $/h</div>
          </div>

          {children}
        </div>
      </ListItem>
      {showPayModal && employed && (
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
    plantageWorks: worker.plantageWorks,
    harvestWorks: worker.harvestWorks,
  });
  return (
    <>
      <div>
        Zarađeno: {totalPay} €, ukupno sati: {totalHours} h, isplaćeno:{" "}
        {worker.payedAmount} €
      </div>
      <div className="info-group">
        <div>{worker.plantageWorks.length} radova na sadnji</div>
        <div>
          {" "}
          Ukupno posađeno ćelija:{" "}
          {worksCoordsSum({ works: worker.plantageWorks, plant: true })}
        </div>
      </div>
      <div className="info-group">
        <div>{worker.harvestWorks.length} radova na berbi</div>
        <div>
          Ukupno požnjeveno ćelija:{" "}
          {worksCoordsSum({ works: worker.harvestWorks })}
        </div>
      </div>
    </>
  );
};

const ProductionWorker = ({ worker }) => {
  const { totalHours, totalPay } = workPayProduction({
    hourlyRate: worker.hourlyRate,
    productionProcesses: worker.productionProcesses,
    warehouseAcceptanceProcesses: worker.warehouseAcceptanceProcesses,
  });
  return (
    <>
      <div>
        Ukupno: {totalPay} €, ukupno sati: {totalHours} h, isplaćeno:{" "}
        {worker.payedAmount} €
      </div>
      <div>
        Slanje na skladište: {worker.productionProcesses.length} procesa,
        količina:{" "}
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
        <div>
          Zarađeno: {totalPay} €, ukupno sati: {totalHours} h, isplaćeno:{" "}
          {worker.payedAmount} €
        </div>
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
    </>
  );
};

const FinancialWorker = ({ worker }) => {
  const { totalHours, totalPay } = workPayFinancial({
    hourlyRate: worker.hourlyRate,
    receipts: worker.receipts,
    warehouseRequests: worker.warehouseRequests,
  });
  return (
    <>
      <div>
        Zarađeno: {totalPay} €, ukupno sati: {totalHours} h, isplaćeno:{" "}
        {worker.payedAmount} €
      </div>
      <div>
        Ukupno poslanih zahtjeva: {worker.warehouseRequests.length} zahtjeva
      </div>
      <div>Ukupno kreirano računa: {worker.receipts.length} računa</div>
    </>
  );
};
