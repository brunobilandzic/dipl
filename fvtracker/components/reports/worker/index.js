"use client";

import managerSectors from "@/lib/constants/users/managerSectors";
import { useSelector } from "react-redux";
import {
  EMPLOYMENT_STATUS_EMPLOYED,
  EMPLOYMENT_STATUS_PENDING,
  EMPLOYMENT_STATUS_UNEMPLOYED,
} from "@/lib/constants/users/workers";
import { ReportSector, ReportSection, ReportItem } from "../dashboard";
import { LoadingFullScreen } from "@/components/layout/loading";

export const WorkersReport = ({
  showTitle = true,
  managerModelName,
  children,
}) => {
  const workers = useSelector((state) => state.workers.items);

  if (!workers || workers.length === 0) return <LoadingFullScreen />;
  const sectorName = managerSectors[managerModelName] || "Sektor";
  return (
    <ReportSector workers={true}>
      <GeneralWorkersReport
        workers={workers}
        title={showTitle ? sectorName : null}
      />
      {children}
    </ReportSector>
  );
};

export const GeneralWorkersReport = ({
  workers,
  title = "Radnici",
  children,
}) => {
  const totalHourlyRate = workers.reduce(
    (sum, worker) => sum + worker.hourlyRate,
    0,
  );
  const employedWorkers = workers.filter(
    (worker) => worker.employmentRequest.status == EMPLOYMENT_STATUS_EMPLOYED,
  );
  const unemployedWorkers = workers.filter(
    (worker) => worker.employmentRequest.status == EMPLOYMENT_STATUS_UNEMPLOYED,
  );
  const pendingWorkers = workers.filter(
    (worker) => worker.employmentRequest.status == EMPLOYMENT_STATUS_PENDING,
  );

  return (
    <ReportSection title={title}>
      <ReportItem count={workers.length} description={"Prijava"} />

      <ReportItem
        count={employedWorkers.length}
        description={"Zaposlen" + (employedWorkers.length > 1 ? "ih" : "")}
      />
      <ReportItem
        count={unemployedWorkers.length}
        description={"Nezaposlen" + (unemployedWorkers.length > 1 ? "ih" : "")}
      />
      <ReportItem count={pendingWorkers.length} description={"Na čekanju"} />
      <ReportItem
        count={totalHourlyRate.toFixed(2)}
        description={"Ukupna satnica (€)"}
      />
      <ReportItem
        count={(totalHourlyRate * 160).toFixed(2)}
        description={"Mesečni trošak (€)"}
      />
      {children}
    </ReportSection>
  );
};
