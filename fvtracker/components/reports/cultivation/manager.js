"use client";

import { useSelector } from "react-redux";
import { ReportSector } from "../dashboard";
import { FieldStats } from "./field";
import { CropsReportSection } from "./crops";

export const CultivationReport = ({}) => {
  const fields = useSelector((state) => state.cultivation.fields);
  if (!fields) return null;
  return (
    <ReportSector title="Kultivacija">
      <FieldStats fields={fields} />
      <CropsReportSection fields={fields} />
    </ReportSector>
  );
};
