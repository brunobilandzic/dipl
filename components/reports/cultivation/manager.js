"use client";

import { useSelector } from "react-redux";
import { ReportSector } from "../dashboard";
import { FieldStats } from "./field";
import { CropsReportSection } from "./crops";
import { LoadingFullScreen } from "@/components/layout/loading";

export const CultivationReport = ({}) => {
  const fields = useSelector((state) => state.cultivation.fields);
  if (!fields) return <LoadingFullScreen />;
  if (fields.length === 0)
    return (
      <ReportSector title="Kultivacija">
        <p className="text-center text-gray-500">
          Nema podataka o kultivaciji.
        </p>
      </ReportSector>
    );
  return (
    <ReportSector title="Kultivacija">
      <FieldStats fields={fields} />
      <CropsReportSection fields={fields} />
    </ReportSector>
  );
};
